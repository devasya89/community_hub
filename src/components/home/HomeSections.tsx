import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Calendar, Phone, MessageSquare, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-building.jpg";

const features = [
  {
    icon: Users,
    title: "Visitor Management",
    description: "Track and manage all visitors with digital records",
  },
  {
    icon: Shield,
    title: "Emergency Contacts",
    description: "Quick access to essential emergency numbers",
  },
  {
    icon: Calendar,
    title: "Events & Activities",
    description: "Stay updated with community events and gatherings",
  },
  {
    icon: MessageSquare,
    title: "Complaint System",
    description: "Submit and track complaints effortlessly",
  },
  {
    icon: Star,
    title: "Amenities",
    description: "Explore and book society amenities",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Round-the-clock assistance for residents",
  },
];

const stats = [
  { value: "500+", label: "Residents" },
  { value: "50+", label: "Amenities" },
  { value: "24/7", label: "Support" },
  { value: "98%", label: "Satisfaction" },
];


const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    unit: "A-101",
    avatar: "RS",
    rating: 5,
    text: "SocietyHub has made managing our daily needs so simple. From booking amenities to tracking visitors, everything is just a tap away!",
  },
  {
    id: 2,
    name: "Priya Patel",
    unit: "B-205",
    avatar: "PP",
    rating: 5,
    text: "The complaint resolution system is fantastic. I submitted an issue and it was resolved within 24 hours. Highly recommended!",
  },
  {
    id: 3,
    name: "Amit Kumar",
    unit: "C-302",
    avatar: "AK",
    rating: 4,
    text: "Love how easy it is to stay updated with society events. The notification system keeps me informed about everything happening around.",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    unit: "D-410",
    avatar: "SG",
    rating: 5,
    text: "As a working professional, this app saves me so much time. I can pre-approve visitors even when I am at work. Brilliant!",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern society complex"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/20 text-secondary text-xs md:text-sm font-medium mb-4 md:mb-6">
              Welcome to Modern Living
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4 md:mb-6"
          >
            Your Complete{" "}
            <span className="text-secondary">Society Management</span>{" "}
            Solution
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-lg text-primary-foreground/80 mb-6 md:mb-8 max-w-xl"
          >
            Streamline community living with our comprehensive platform. Manage visitors, book amenities, and stay connected.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link to="/select-society" className="flex-1 sm:flex-none">
              <Button variant="gold" size="lg" className="gap-2 w-full sm:w-auto text-base h-12 md:h-14">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/amenities" className="flex-1 sm:flex-none">
              <Button variant="heroLight" size="lg" className="w-full sm:w-auto text-base h-12 md:h-14">
                Explore Amenities
              </Button>
            </Link>
          </motion.div>

          {/* Stats - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-4 gap-3 md:gap-6 mt-10 md:mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-4xl font-display font-bold text-secondary">
                  {stat.value}
                </div>
                <div className="text-[10px] md:text-sm text-primary-foreground/70 mt-0.5 md:mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8 md:mb-16"
        >
          <span className="text-secondary font-medium text-xs md:text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-2 md:mt-3 mb-2 md:mb-4">
            Everything for{" "}
            <span className="gradient-text">Community Living</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Access all society services from one unified platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-4 md:p-6 rounded-xl md:rounded-2xl active:scale-[0.98] transition-all duration-300 group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl gold-gradient flex items-center justify-center mb-3 md:mb-4">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-display text-sm md:text-xl font-semibold text-foreground mb-1 md:mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8 md:mb-16"
        >
          <span className="text-secondary font-medium text-xs md:text-sm uppercase tracking-wider">
            What Residents Say
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mt-2 md:mt-3 mb-2 md:mb-4">
            Trusted by <span className="gradient-text">Our Community</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Hear from residents who love SocietyHub.
          </p>
        </motion.div>

        {/* Mobile: Horizontal scroll, Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-4 md:p-6 rounded-xl md:rounded-2xl min-w-[280px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-3 right-3 opacity-10">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 md:w-4 md:h-4 ${
                      i < testimonial.rating
                        ? "text-secondary fill-secondary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground text-xs md:text-sm mb-4 line-clamp-3 md:line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 md:gap-3 mt-auto">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full gold-gradient flex items-center justify-center">
                  <span className="text-xs md:text-sm font-bold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-xs md:text-sm">{testimonial.name}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Unit {testimonial.unit}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-12 md:py-24 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-4 md:mb-6">
            Ready to Transform Your{" "}
            <span className="text-secondary">Community?</span>
          </h2>
          <p className="text-primary-foreground/80 mb-6 md:mb-8 text-sm md:text-lg">
            Join thousands of residents who love SocietyHub.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link to="/select-society" className="flex-1 sm:flex-none">
              <Button variant="gold" size="lg" className="gap-2 w-full sm:w-auto h-12">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact-us" className="flex-1 sm:flex-none">
              <Button variant="heroLight" size="lg" className="w-full sm:w-auto h-12">
                Contact Admin
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
