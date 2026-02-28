import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, Key, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";

type LoginMode = "normal" | "super";
type AuthMode = "signin" | "signup";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginAsAdmin } = useAdmin();
  const { signUp } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showSuperKey, setShowSuperKey] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>("normal");
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    superKey: "",
    adminSignupKey: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMode === "super" && !formData.superKey) {
      toast({ title: "Super Key Required", description: "Please enter the super admin key.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const result = await loginAsAdmin(
      formData.email,
      formData.password,
      loginMode === "super" ? formData.superKey : undefined
    );
    setIsLoading(false);

    if (result.success) {
      toast({
        title: loginMode === "super" ? "Welcome, Super Admin!" : "Welcome, Admin!",
        description: loginMode === "super" ? "You have full access to all societies." : "You are now logged in as an admin.",
      });
      navigate("/admin/dashboard");
    } else {
      toast({ title: "Login Failed", description: result.error || "Invalid credentials.", variant: "destructive" });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.adminSignupKey !== "societyyhubb") {
      toast({ title: "Invalid Key", description: "The admin signup key is incorrect.", variant: "destructive" });
      return;
    }

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.name,
      phone: formData.phone,
    });
    setIsLoading(false);

    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Account Created!",
      description: "Please verify your email, then sign in. A super admin must assign you the admin role.",
    });
    setAuthMode("signin");
  };

  const handleSubmit = authMode === "signin" ? handleSignIn : handleSignUp;

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl bg-card/95">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-xl gold-gradient flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Authorized personnel only</p>
          </div>

          {/* Auth Mode Toggle (Sign In / Sign Up) */}
          <div className="flex rounded-lg bg-muted p-1 mb-4">
            <button
              type="button"
              onClick={() => setAuthMode("signin")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                authMode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Mode Toggle (Normal / Super) - only for sign in */}
          {authMode === "signin" && (
            <div className="flex rounded-lg bg-muted p-1 mb-6">
              <button
                type="button"
                onClick={() => setLoginMode("normal")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  loginMode === "normal" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Normal Admin
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("super")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  loginMode === "super" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Super Admin
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Signup Key & fields - only for sign up */}
            {authMode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="adminSignupKey">Admin Signup Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="adminSignupKey" type="password" placeholder="Enter admin signup key" className="pl-10" value={formData.adminSignupKey} onChange={(e) => setFormData({ ...formData, adminSignupKey: e.target.value })} required />
                  </div>
                  <p className="text-xs text-muted-foreground">Contact your super admin to get this key.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@example.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password - only for sign up */}
            {authMode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                </div>
              </div>
            )}

            {/* Super Key - only for super admin sign in */}
            {authMode === "signin" && loginMode === "super" && (
              <div className="space-y-2">
                <Label htmlFor="superKey">Super Admin Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="superKey" type={showSuperKey ? "text" : "password"} placeholder="Enter super admin key" className="pl-10 pr-10" value={formData.superKey} onChange={(e) => setFormData({ ...formData, superKey: e.target.value })} />
                  <button type="button" onClick={() => setShowSuperKey(!showSuperKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showSuperKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Only for authorized super admin (icoc7772@gmail.com).</p>
              </div>
            )}

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading
                ? (authMode === "signin" ? "Authenticating..." : "Creating Account...")
                : (authMode === "signin" ? "Access Admin Panel" : "Create Admin Account")
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
