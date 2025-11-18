import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeToggle } from "./ThemeToggle";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform">
              {/* <img src="/logo.png" alt="Liminox Logo" className="h-8 w-auto" /> */}
              <img src="/LIMINOX LOGO.svg" alt="Liminox Logo" width={50} height={20} />
            </div>


            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Liminox
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-foreground/80"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Contact
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive("/dashboard") ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">{user.email}</span>
                </div>
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive("/") ? "bg-accent text-primary" : "text-foreground/80 hover:bg-accent/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive("/about") ? "bg-accent text-primary" : "text-foreground/80 hover:bg-accent/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  isActive("/contact") ? "bg-accent text-primary" : "text-foreground/80 hover:bg-accent/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                      isActive("/dashboard") ? "bg-accent text-primary" : "text-foreground/80 hover:bg-accent/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="px-4">
                    <ThemeToggle />
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <div className="px-4">
                    <ThemeToggle />
                  </div>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
