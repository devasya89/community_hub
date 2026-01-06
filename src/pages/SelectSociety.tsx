import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Building2, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { societies, useSociety } from "@/contexts/SocietyContext";
import { Button } from "@/components/ui/button";

const SelectSociety = () => {
  const navigate = useNavigate();
  const { selectSociety } = useSociety();

  const handleSelectSociety = (societyId: string) => {
    const society = societies.find((s) => s.id === societyId);
    if (society) {
      selectSociety(society);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Society<span className="gradient-text">Hub</span>
            </span>
          </Link>
          
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-secondary/30 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-secondary group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium text-foreground">Back to Home</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Welcome to SocietyHub
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Select Your <span className="gradient-text">Society</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your residential society to access amenities, events, visitor management, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {societies.map((society, index) => (
              <motion.div
                key={society.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => handleSelectSociety(society.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={society.image}
                    alt={society.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {society.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="text-sm">{society.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{society.amenities.length} Amenities</span>
                    <span>{society.events.length} Upcoming Events</span>
                  </div>

                  <Button variant="gold" className="w-full group-hover:gap-3 transition-all">
                    Select Society
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Don't see your society?{" "}
              <Link to="/contact-us" className="text-secondary font-medium hover:underline">
                Contact us
              </Link>{" "}
              to add it.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SelectSociety;
