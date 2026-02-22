import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, Key, Building2, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { useSocieties } from "@/contexts/SocietyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LoginMode = "normal" | "super";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAdminType, setAssignedSociety, setSelectedAdminSociety } = useAdmin();
  const { societies } = useSocieties();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showSuperKey, setShowSuperKey] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("normal");
  const [selectedSociety, setSelectedSociety] = useState<typeof societies[0] | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    superKey: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMode === "normal" && !selectedSociety) {
      toast({
        title: "Society Required",
        description: "Please select your assigned society to continue.",
        variant: "destructive",
      });
      return;
    }

    if (loginMode === "super" && !formData.superKey) {
      toast({
        title: "Super Key Required",
        description: "Please enter the super admin key to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      if (loginMode === "super") {
        // Simple key validation - in production this would be server-side
        if (formData.superKey !== "SOCIETYHUB_SUPER_2024") {
          setIsLoading(false);
          toast({
            title: "Invalid Super Key",
            description: "The super admin key you entered is incorrect.",
            variant: "destructive",
          });
          return;
        }
        setAdminType("super");
        setSelectedAdminSociety(societies[0]); // Default to first society for super admin
        toast({
          title: "Welcome, Super Admin!",
          description: "You have full access to all societies.",
        });
      } else {
        setAdminType("normal");
        setAssignedSociety(selectedSociety);
        toast({
          title: "Welcome, Admin!",
          description: `You are managing ${selectedSociety?.name}.`,
        });
      }
      
      setIsLoading(false);
      navigate("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl bg-card/95">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Portal
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Authorized personnel only
            </p>
          </div>

          {/* Login Mode Toggle */}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginMode("normal")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMode === "normal"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Normal Admin
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("super")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMode === "super"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Super Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@societyhub.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginMode === "normal" && (
              <div className="space-y-2">
                <Label>Assigned Society</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className={selectedSociety ? "text-foreground" : "text-muted-foreground"}>
                          {selectedSociety?.name || "Select your society"}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[320px]">
                    {societies.map((society) => (
                      <DropdownMenuItem
                        key={society.id}
                        onClick={() => setSelectedSociety(society)}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{society.name}</p>
                          <p className="text-xs text-muted-foreground">{society.address}</p>
                        </div>
                        {selectedSociety?.id === society.id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {loginMode === "super" && (
              <div className="space-y-2">
                <Label htmlFor="superKey">Super Admin Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="superKey"
                    type={showSuperKey ? "text" : "password"}
                    placeholder="Enter super admin key"
                    className="pl-10 pr-10"
                    value={formData.superKey}
                    onChange={(e) => setFormData({ ...formData, superKey: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuperKey(!showSuperKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSuperKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This key provides full access to all societies. Keep it confidential.
                </p>
              </div>
            )}

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
