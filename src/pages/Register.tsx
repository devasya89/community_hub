import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Building2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSociety } from "@/contexts/SocietyContext";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const { selectedSociety } = useSociety();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    flatNo: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedSociety) {
    return <Navigate to="/select-society" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.name,
      phone: formData.phone,
      society_id: selectedSociety.id,
      unit_number: formData.flatNo,
    });

    if (error) {
      setIsLoading(false);
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      return;
    }

    setIsLoading(false);
    toast({
      title: "Account Created!",
      description: "Please check your email to verify your account before logging in.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-lg"
        >
          <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-8">
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Join Our Community
          </h2>
          <p className="text-primary-foreground/70">
            Create your account to access exclusive features, manage your flat services, and connect with your neighbors.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Society<span className="gradient-text">Hub</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-2">Register for <span className="font-semibold text-foreground">{selectedSociety.name}</span></p>
          <p className="text-muted-foreground mb-8 text-sm">
            <Link to="/select-society" className="text-secondary hover:underline">Change society</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@email.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" className="pl-10" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flatNo">Flat Number</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="flatNo" placeholder="e.g., A-101" className="pl-10" value={formData.flatNo} onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
