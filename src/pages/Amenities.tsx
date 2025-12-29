import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { 
  Dumbbell, 
  Waves, 
  Car, 
  Trees, 
  Gamepad2, 
  Building, 
  Coffee, 
  Wifi,
  Shield,
  Sparkles
} from "lucide-react";

const amenities = [
  {
    icon: Dumbbell,
    name: "Fitness Center",
    description: "State-of-the-art gym with modern equipment and personal trainers",
    category: "Health & Wellness",
  },
  {
    icon: Waves,
    name: "Swimming Pool",
    description: "Olympic-sized pool with separate kids' area and trained lifeguards",
    category: "Recreation",
  },
  {
    icon: Car,
    name: "Covered Parking",
    description: "Multi-level secure parking with dedicated visitor spots",
    category: "Convenience",
  },
  {
    icon: Trees,
    name: "Landscaped Gardens",
    description: "Beautifully maintained green spaces for relaxation",
    category: "Outdoors",
  },
  {
    icon: Gamepad2,
    name: "Recreation Room",
    description: "Indoor games, table tennis, and entertainment area",
    category: "Recreation",
  },
  {
    icon: Building,
    name: "Community Hall",
    description: "Spacious venue for events, meetings, and celebrations",
    category: "Community",
  },
  {
    icon: Coffee,
    name: "Café & Lounge",
    description: "In-house café serving refreshments and light snacks",
    category: "Dining",
  },
  {
    icon: Wifi,
    name: "High-Speed Internet",
    description: "Fiber optic connectivity throughout the premises",
    category: "Technology",
  },
  {
    icon: Shield,
    name: "24/7 Security",
    description: "CCTV surveillance and trained security personnel",
    category: "Security",
  },
  {
    icon: Sparkles,
    name: "Spa & Wellness",
    description: "Relaxation spa with massage and wellness treatments",
    category: "Health & Wellness",
  },
];

const Amenities = () => {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              Premium Facilities
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              World-Class <span className="gradient-text">Amenities</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Experience luxury living with our comprehensive range of modern amenities designed for comfort and convenience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <amenity.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">
                      {amenity.category}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2">
                      {amenity.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {amenity.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Amenities;
