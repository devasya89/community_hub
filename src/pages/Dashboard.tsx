import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Megaphone, 
  Calendar, 
  Users, 
  MessageSquare, 
  Phone, 
  Star,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useSociety } from "@/contexts/SocietyContext";

// Society-specific notices data
const societyNotices: Record<string, Array<{
  id: number;
  title: string;
  date: string;
  description: string;
  priority: "high" | "medium" | "low";
}>> = {
  "greenwood-heights": [
    {
      id: 1,
      title: "Annual General Meeting",
      date: "Jan 15, 2026",
      description: "All residents are requested to attend the AGM at the community hall at 6 PM. Important decisions regarding society maintenance will be discussed.",
      priority: "high",
    },
    {
      id: 2,
      title: "Water Tank Cleaning",
      date: "Jan 12, 2026",
      description: "Water supply will be interrupted from 10 AM to 2 PM for routine tank cleaning.",
      priority: "medium",
    },
    {
      id: 3,
      title: "New Gym Equipment Installed",
      date: "Jan 8, 2026",
      description: "New treadmills and weight machines have been added to the fitness center.",
      priority: "low",
    },
  ],
  "sunrise-residency": [
    {
      id: 1,
      title: "Parking Slot Allocation",
      date: "Jan 20, 2026",
      description: "New parking slot allocation will be done. Please submit your vehicle details by Jan 18.",
      priority: "high",
    },
    {
      id: 2,
      title: "CCTV Maintenance",
      date: "Jan 14, 2026",
      description: "CCTV cameras will undergo maintenance from 9 AM to 12 PM. Security guards will be on extra patrol.",
      priority: "medium",
    },
  ],
  "palm-grove-society": [
    {
      id: 1,
      title: "Infinity Pool Reopening",
      date: "Jan 10, 2026",
      description: "The rooftop infinity pool is now open after renovation with new heating system installed.",
      priority: "high",
    },
    {
      id: 2,
      title: "Organic Garden Harvest",
      date: "Jan 18, 2026",
      description: "Fresh vegetables from our rooftop garden will be distributed to residents. Register at the front desk.",
      priority: "low",
    },
    {
      id: 3,
      title: "Spa Services Update",
      date: "Jan 15, 2026",
      description: "New aromatherapy and massage services now available. Book through the society app.",
      priority: "medium",
    },
  ],
};

const quickActions = [
  { icon: Users, label: "Visitor Entry", href: "/visitors", color: "bg-blue-500/10 text-blue-500" },
  { icon: MessageSquare, label: "Raise Complaint", href: "/complaints", color: "bg-orange-500/10 text-orange-500" },
  { icon: Star, label: "Book Amenity", href: "/amenities", color: "bg-purple-500/10 text-purple-500" },
  { icon: Phone, label: "Emergency", href: "/contact", color: "bg-destructive/10 text-destructive" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedSociety, isLoggedIn } = useSociety();

  useEffect(() => {
    if (!isLoggedIn || !selectedSociety) {
      navigate("/select-society");
    }
  }, [isLoggedIn, selectedSociety, navigate]);

  if (!selectedSociety) return null;

  const notices = societyNotices[selectedSociety.id] || [];
  const upcomingEvents = selectedSociety.events.slice(0, 3);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <Info className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium":
        return "bg-secondary/10 text-secondary border-secondary/30";
      default:
        return "bg-green-500/10 text-green-600 border-green-500/30";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome to <span className="gradient-text">{selectedSociety.name}</span>
            </h1>
            <p className="text-muted-foreground">{selectedSociety.address}</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-4 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-foreground text-sm">{action.label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Notice Board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  Notice Board
                </h2>
              </div>
              <div className="space-y-4">
                {notices.length > 0 ? (
                  notices.map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="glass-card p-5 rounded-xl hover:shadow-md transition-all duration-300 border border-border/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(notice.priority)} flex-shrink-0`}>
                          {getPriorityIcon(notice.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notice.priority)} capitalize`}>
                              {notice.priority}
                            </span>
                            <span className="text-xs text-muted-foreground">{notice.date}</span>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1">{notice.title}</h3>
                          <p className="text-sm text-muted-foreground">{notice.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-card p-8 rounded-xl text-center">
                    <Megaphone className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No notices at this time</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Events
                </h2>
                <Link to="/events">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="glass-card rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-border/50"
                    >
                      <div className="flex">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{event.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="glass-card p-8 rounded-xl text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming events</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Emergency Contacts Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Emergency Contacts
              </h2>
              <Link to="/contact">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {selectedSociety.emergencyContacts.slice(0, 3).map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="glass-card p-4 rounded-xl border border-border/50"
                >
                  <p className="font-medium text-foreground">{contact.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{contact.role}</p>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-primary font-medium text-sm hover:underline"
                  >
                    {contact.phone}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;