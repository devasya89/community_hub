import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSociety } from "@/contexts/SocietyContext";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedSociety, setIsLoggedIn, setUserRole } = useSociety();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedSociety) {
    return <Navigate to="/select-society" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsLoggedIn(true);
    setUserRole("user");
    setIsLoading(false);
    toast({
      title: "Welcome back!",
      description: `You have successfully logged in to ${selectedSociety.name}.`,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
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

          {/* Selected Society Info */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <img
                src={selectedSociety.image}
                alt={selectedSociety.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{selectedSociety.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedSociety.address}
                </p>
              </div>
              <Link to="/select-society" className="text-sm text-secondary hover:underline">
                Change
              </Link>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Sign in to access your society services.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-secondary hover:underline">
                  Forgot password?
                </Link>
              </div>
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

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-secondary font-medium hover:underline">
              Create account
            </Link>
          </p>

          <p className="text-center text-muted-foreground mt-4">
            <Link to="/contact-us" className="text-secondary font-medium hover:underline">
              Contact Us
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
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
            {selectedSociety.name}
          </h2>
          <p className="text-primary-foreground/70">
            Access all society services, manage visitors, book amenities, and stay updated with community events.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
