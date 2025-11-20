import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfName: string;
}

const PDFViewer = ({ isOpen, onClose, pdfUrl, pdfName }: PDFViewerProps) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background">
            <h2 className="text-lg font-semibold truncate max-w-[60%]">{pdfName}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PDF Container */}
          <div className="flex-1 overflow-auto bg-muted/30 p-4">
            <div className="mx-auto" style={{ width: `${zoom}%` }}>
              <iframe
                src={pdfUrl}
                className="w-full h-[calc(95vh-80px)] border-0 rounded-lg shadow-lg"
                title={pdfName}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
