import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Building2, MapPin, ArrowRight, ArrowLeft, Search } from "lucide-react";
import { societies, useSociety } from "@/contexts/SocietyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SelectSociety = () => {
  const navigate = useNavigate();
  const { selectSociety } = useSociety();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSocieties = societies.filter(
    (society) =>
      society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      society.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSociety = (societyId: string) => {
    const society = societies.find((s) => s.id === societyId);
    if (society) {
      selectSociety(society);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header - Mobile Optimized */}
      <div className="bg-primary/5 border-b border-border sticky top-0 z-40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 md:py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="font-display text-lg md:text-xl font-semibold text-foreground">
              Society<span className="gradient-text">Hub</span>
            </span>
          </Link>
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <section className="py-6 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-6 md:mb-12"
          >
            <h1 className="font-display text-2xl md:text-5xl font-bold text-foreground mb-2 md:mb-4">
              Select Your <span className="gradient-text">Society</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg">
              Choose your society to get started
            </p>
            
            {/* Search Bar - Mobile Optimized */}
            <div className="relative mt-4 md:mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search society..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 h-12 rounded-xl md:rounded-full border-2 border-border bg-background/50 backdrop-blur-sm focus:border-secondary transition-colors text-base"
              />
            </div>
          </motion.div>

          {/* Society Cards - Mobile Optimized as List */}
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 max-w-6xl mx-auto">
            {filteredSocieties.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No societies found matching "{searchQuery}"</p>
              </div>
            ) : filteredSocieties.map((society, index) => (
              <motion.div
                key={society.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl md:rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-300"
                onClick={() => handleSelectSociety(society.id)}
              >
                {/* Mobile: Horizontal layout, Desktop: Vertical */}
                <div className="flex md:flex-col">
                  <div className="relative w-24 h-24 md:w-full md:h-48 flex-shrink-0">
                    <img
                      src={society.image}
                      alt={society.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-3 md:p-6 flex flex-col justify-center">
                    <h3 className="font-display text-base md:text-xl font-semibold text-foreground mb-1">
                      {society.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground mb-2 md:mb-4">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-secondary flex-shrink-0" />
                      <span className="text-xs md:text-sm truncate">{society.address}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{society.amenities.length} Amenities</span>
                      <span>•</span>
                      <span>{society.events.length} Events</span>
                    </div>
                  </div>

                  {/* Mobile: Arrow indicator */}
                  <div className="flex items-center pr-3 md:hidden">
                    <ArrowRight className="w-5 h-5 text-secondary" />
                  </div>

                  {/* Desktop: Full button */}
                  <div className="hidden md:block p-6 pt-0">
                    <Button variant="gold" className="w-full">
                      Select Society
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
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
