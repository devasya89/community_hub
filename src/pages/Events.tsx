import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSociety } from "@/contexts/SocietyContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  image: string | null;
  status: string;
  max_attendees: number | null;
}

const Events = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; eventId: string; eventTitle: string }>({ open: false, eventId: "", eventTitle: "" });

  useEffect(() => {
    if (!selectedSociety) return;
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("society_id", selectedSociety.id)
        .order("date");
      setEvents(data || []);
      setIsLoading(false);
    };
    fetchEvents();
  }, [selectedSociety]);

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const openConfirmDialog = (eventId: string, eventTitle: string) => {
    if (registeredEvents.includes(eventId)) {
      toast({ title: "Already Registered", description: `You are already registered for ${eventTitle}.`, variant: "destructive" });
      return;
    }
    setConfirmDialog({ open: true, eventId, eventTitle });
  };

  const handleConfirmRegister = () => {
    setRegisteredEvents((prev) => [...prev, confirmDialog.eventId]);
    toast({ title: "Registration Successful!", description: `You have been registered for ${confirmDialog.eventTitle}.` });
    setConfirmDialog({ open: false, eventId: "", eventTitle: "" });
  };

  const isRegistered = (eventId: string) => registeredEvents.includes(eventId);

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
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">{selectedSociety.name}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg">Stay connected with your community through exciting events and activities.</p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12"><p className="text-muted-foreground">Loading events...</p></div>
          ) : events.length === 0 ? (
            <div className="text-center py-12"><p className="text-muted-foreground text-lg">No upcoming events at the moment.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card rounded-2xl overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image || ""} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium capitalize">{event.status}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-secondary" /><span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {event.time && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4 text-secondary" /><span>{event.time}</span></div>}
                      {event.location && <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-secondary" /><span>{event.location}</span></div>}
                    </div>
                    <Button variant={isRegistered(event.id) ? "outline" : "gold"} className="w-full" onClick={() => openConfirmDialog(event.id, event.title)} disabled={isRegistered(event.id)}>
                      {isRegistered(event.id) ? (<><CheckCircle className="w-4 h-4 mr-2" />Registered</>) : "Register Now"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to register for "{confirmDialog.eventTitle}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegister}>Confirm Registration</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Events;
