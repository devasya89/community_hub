import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { 
  Dumbbell, Waves, Car, Trees, Gamepad2, Building, Coffee, Wifi, Shield, Sparkles, LucideIcon
} from "lucide-react";
import { useSociety } from "@/contexts/SocietyContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = {
  Dumbbell, Waves, Car, Trees, Gamepad2, Building, Coffee, Wifi, Shield, Sparkles,
};

interface Amenity {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
}

const Amenities = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedSociety) return;
    const fetchAmenities = async () => {
      const { data } = await supabase
        .from("amenities")
        .select("*")
        .eq("society_id", selectedSociety.id);
      setAmenities(data || []);
      setIsLoading(false);
    };
    fetchAmenities();
  }, [selectedSociety]);

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  return (
    <Layout showChatbot>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              {selectedSociety.name}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Premium <span className="gradient-text">Amenities</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Experience luxury living with our comprehensive range of modern amenities.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading amenities...</p>
            </div>
          ) : amenities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No amenities listed for this society.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity, index) => {
                const IconComponent = iconMap[amenity.icon || ""] || Building;
                return (
                  <motion.div
                    key={amenity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                          {amenity.category}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2">
                          {amenity.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">{amenity.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Amenities;
