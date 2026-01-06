import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Building2, Shield, LogOut, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSociety } from "@/contexts/SocietyContext";
const navLinks = [
  { href: "/amenities", label: "Amenities" },
  { href: "/events", label: "Events" },
  { href: "/visitors", label: "Visitors" },
  { href: "/complaints", label: "Complaints" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSociety, isLoggedIn, clearSociety } = useSociety();

  const handleLogout = () => {
    clearSociety();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Society<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Society Badge (if logged in) */}
          {selectedSociety && isLoggedIn && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">{selectedSociety.name}</span>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isLoggedIn && selectedSociety ? (
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Home
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && selectedSociety ? (
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/select-society">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="gold" size="sm" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Society Badge Mobile */}
              {selectedSociety && isLoggedIn && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 text-secondary text-sm mb-4">
                  <MapPin className="w-3 h-3" />
                  <span className="font-medium">{selectedSociety.name}</span>
                </div>
              )}
              
              {isLoggedIn && selectedSociety ? (
                navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === "/"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Home
                </Link>
              )}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <div className="flex gap-3">
                  {isLoggedIn && selectedSociety ? (
                    <Button variant="outline" className="w-full gap-2" onClick={() => { handleLogout(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link to="/select-society" className="flex-1" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/admin/login" className="flex-1" onClick={() => setIsOpen(false)}>
                        <Button variant="gold" className="w-full gap-2">
                          <Shield className="w-4 h-4" />
                          Admin
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
