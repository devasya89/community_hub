import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Calendar, Phone, MessageSquare, Star, Megaphone, Quote } from "lucide-react";
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

const notices = [
  {
    id: 1,
    title: "Annual General Meeting",
    date: "Jan 15, 2026",
    description: "All residents are requested to attend the AGM at the community hall at 6 PM.",
    priority: "high",
  },
  {
    id: 2,
    title: "Water Supply Maintenance",
    date: "Jan 10, 2026",
    description: "Water supply will be interrupted from 10 AM to 2 PM for tank cleaning.",
    priority: "medium",
  },
  {
    id: 3,
    title: "New Gym Equipment",
    date: "Jan 8, 2026",
    description: "New fitness equipment has been installed in the society gym. Check it out!",
    priority: "low",
  },
  {
    id: 4,
    title: "Parking Rules Update",
    date: "Jan 5, 2026",
    description: "Please park only in designated spots. Violators will be fined.",
    priority: "medium",
  },
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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern society complex"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
              Welcome to Modern Living
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Your Complete{" "}
            <span className="text-secondary">Society Management</span>{" "}
            Solution
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-primary-foreground/80 mb-8 max-w-xl"
          >
            Streamline community living with our comprehensive platform. Manage visitors, book amenities, report issues, and stay connected with your neighbors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/register">
              <Button variant="gold" size="xl" className="gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/amenities">
              <Button variant="heroLight" size="xl">
                Explore Amenities
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-display font-bold text-secondary">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 mt-1">
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
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Everything You Need for{" "}
            <span className="gradient-text">Community Living</span>
          </h2>
          <p className="text-muted-foreground">
            Access all society services from one unified platform designed for modern residential communities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NoticeBoardSection() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium":
        return "bg-secondary/10 text-secondary border-secondary/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Stay Informed
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Society <span className="gradient-text">Notice Board</span>
          </h2>
          <p className="text-muted-foreground">
            Important announcements and updates from the society management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {notices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-border/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Megaphone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {notice.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            What Residents Say
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Trusted by <span className="gradient-text">Our Community</span>
          </h2>
          <p className="text-muted-foreground">
            Hear from residents who have transformed their community living experience with SocietyHub.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-10 h-10 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? "text-secondary fill-secondary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-muted-foreground text-sm mb-6 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">Unit {testimonial.unit}</p>
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
    <section className="py-24 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your{" "}
            <span className="text-secondary">Community Experience?</span>
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Join thousands of residents who have simplified their society management with SocietyHub.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button variant="gold" size="xl" className="gap-2">
                Register Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button variant="heroLight" size="xl">
                Contact Admin
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
