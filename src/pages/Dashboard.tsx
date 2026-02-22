import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Megaphone, Calendar, Users, MessageSquare, Phone, Star, Clock, MapPin, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useSociety } from "@/contexts/SocietyContext";
import { supabase } from "@/integrations/supabase/client";

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  image: string | null;
}

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface Notice {
  id: string;
  title: string;
  content: string | null;
  is_important: boolean;
  created_at: string;
}

const quickActions = [
  { icon: Users, label: "Visitor Entry", href: "/visitors", color: "bg-blue-500/10 text-blue-500" },
  { icon: MessageSquare, label: "Raise Complaint", href: "/complaints", color: "bg-orange-500/10 text-orange-500" },
  { icon: Star, label: "Book Amenity", href: "/amenities", color: "bg-purple-500/10 text-purple-500" },
  { icon: Phone, label: "Emergency", href: "/contact", color: "bg-destructive/10 text-destructive" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedSociety, isLoggedIn } = useSociety();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !selectedSociety) {
      navigate("/select-society");
    }
  }, [isLoggedIn, selectedSociety, navigate]);

  useEffect(() => {
    if (!selectedSociety) return;
    const fetchData = async () => {
      const [eventsRes, contactsRes, noticesRes] = await Promise.all([
        supabase.from("events").select("id, title, date, time, location, image").eq("society_id", selectedSociety.id).order("date").limit(3),
        supabase.from("emergency_contacts").select("*").eq("society_id", selectedSociety.id).limit(3),
        supabase.from("notices").select("*").eq("society_id", selectedSociety.id).order("created_at", { ascending: false }).limit(3),
      ]);
      setEvents(eventsRes.data || []);
      setEmergencyContacts(contactsRes.data || []);
      setNotices(noticesRes.data || []);
    };
    fetchData();
  }, [selectedSociety]);

  if (!selectedSociety) return null;

  const getPriorityIcon = (isImportant: boolean) => isImportant ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />;
  const getPriorityColor = (isImportant: boolean) => isImportant ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-secondary/10 text-secondary border-secondary/30";

  return (
    <Layout showFooter={false} showChatbot>
      <div className="min-h-screen bg-muted/30 py-4 md:py-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-1">Welcome 👋</h1>
            <p className="text-lg md:text-xl gradient-text font-semibold">{selectedSociety.name}</p>
            <p className="text-sm text-muted-foreground">{selectedSociety.address}</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <motion.div whileTap={{ scale: 0.95 }} className="glass-card p-3 md:p-4 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group text-center">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-2 group-active:scale-95 transition-transform`}>
                      <action.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <p className="font-medium text-foreground text-xs md:text-sm">{action.label}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />Notices
              </h2>
            </div>
            <div className="space-y-3">
              {notices.length > 0 ? notices.map((notice, index) => (
                <motion.div key={notice.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }} className="glass-card p-4 rounded-xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(notice.is_important)} flex-shrink-0`}>{getPriorityIcon(notice.is_important)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notice.is_important)}`}>{notice.is_important ? "Important" : "Info"}</span>
                        <span className="text-xs text-muted-foreground">{new Date(notice.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{notice.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notice.content}</p>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="glass-card p-6 rounded-xl text-center">
                  <Megaphone className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No notices at this time</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Events */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Events</h2>
              <Link to="/events"><Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs h-8">View All</Button></Link>
            </div>
            <div className="space-y-3">
              {events.length > 0 ? events.map((event, index) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }} className="glass-card rounded-xl overflow-hidden border border-border/50">
                  <div className="flex">
                    <div className="w-20 h-20 flex-shrink-0"><img src={event.image || ""} alt={event.title} className="w-full h-full object-cover" /></div>
                    <div className="p-3 flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{event.title}</h3>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="glass-card p-6 rounded-xl text-center"><Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" /><p className="text-muted-foreground text-sm">No upcoming events</p></div>
              )}
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2"><Phone className="w-5 h-5 text-destructive" />Emergency</h2>
              <Link to="/contact"><Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs h-8">View All</Button></Link>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {emergencyContacts.map((contact) => (
                <motion.a key={contact.id} href={`tel:${contact.phone}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 rounded-xl border border-border/50 flex items-center justify-between">
                  <div><p className="font-medium text-foreground text-sm">{contact.name}</p><p className="text-xs text-muted-foreground">{contact.role}</p></div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-medium text-sm">{contact.phone}</span>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Phone className="w-4 h-4 text-primary" /></div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
