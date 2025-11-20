import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Trash2, Presentation } from "lucide-react";
import PDFViewer from "@/components/PDFViewer";
import type { User } from "@supabase/supabase-js";

interface PDFFile {
  name: string;
  url: string;
  path: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PDFFile | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadPDFs();
    }
  }, [user]);

  const loadPDFs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from("pdfs")
        .list(`${user.id}/`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const pdfFiles = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from("pdfs")
            .createSignedUrl(`${user.id}/${file.name}`, 3600);

          return {
            name: file.name,
            url: urlData?.signedUrl || "",
            path: `${user.id}/${file.name}`,
            created_at: file.created_at,
          };
        })
      );

      setPdfs(pdfFiles);
    } catch (error: any) {
      toast({
        title: "Error loading PDFs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a PDF smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "PDF uploaded successfully",
      });

      loadPDFs();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeletePDF = async (path: string) => {
    try {
      const { error } = await supabase.storage.from("pdfs").remove([path]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "PDF deleted successfully",
      });

      loadPDFs();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Logged out successfully" });
        navigate("/");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Unexpected error", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
            <p className="text-muted-foreground mb-2">
              You're logged in as: <span className="text-foreground font-medium">{user?.email}</span>
            </p>
            <p className="text-muted-foreground">
              User ID: <span className="text-foreground font-mono text-sm">{user?.id}</span>
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">My Presentations</h2>
              <label htmlFor="pdf-upload">
                <Button disabled={uploading} asChild>
                  <span className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload PDF"}
                  </span>
                </Button>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {pdfs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No PDFs uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a PDF to start presenting
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pdfs.map((pdf) => (
                  <div
                    key={pdf.path}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{pdf.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pdf.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedPdf(pdf)}
                      >
                        <Presentation className="h-4 w-4 mr-2" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePDF(pdf.path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPdf && (
        <PDFViewer
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
          pdfUrl={selectedPdf.url}
          pdfName={selectedPdf.name}
        />
      )}
    </>
  );
};

export default Dashboard;
