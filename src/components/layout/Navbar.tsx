
import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Plane, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useSupabaseAuth";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const links = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
    { path: "/flights", label: "Flights", icon: <Plane className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md animate-fade-in">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" />
          <span className="text-xl font-semibold hidden sm:inline">Flight Manager</span>
          <span className="text-xl font-semibold sm:hidden">FM</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md hover:bg-muted ${
                isActive(link.path) 
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        
        {/* Desktop Logout Button */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <div className="text-sm text-muted-foreground mr-2">
              {user.email}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-slide-in-bottom">
          <div className="container py-4">
            <nav className="flex flex-col gap-2">
              {links.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 text-sm font-medium transition-colors px-4 py-3 rounded-md hover:bg-muted ${
                    isActive(link.path) 
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {user && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  {user.email}
                </div>
              )}
              <Button
                variant="ghost"
                className="flex items-center gap-3 justify-start text-sm font-medium text-muted-foreground px-4 py-3 h-auto hover:bg-muted hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                Log out
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
