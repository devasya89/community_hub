import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSociety } from "@/contexts/SocietyContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const { toast } = useToast();
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const events = selectedSociety.events;

  const handleRegister = (eventId: string, eventTitle: string) => {
    if (registeredEvents.includes(eventId)) {
      toast({
        title: "Already Registered",
        description: `You are already registered for ${eventTitle}.`,
        variant: "destructive",
      });
      return;
    }
    
    setRegisteredEvents((prev) => [...prev, eventId]);
    toast({
      title: "Registration Successful!",
      description: `You have been registered for ${eventTitle}.`,
    });
  };

  const isRegistered = (eventId: string) => registeredEvents.includes(eventId);

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
              {selectedSociety.name}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay connected with your community through exciting events and activities.
            </p>
          </motion.div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No upcoming events at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-secondary" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>

                    <Button 
                      variant={isRegistered(event.id) ? "outline" : "gold"} 
                      className="w-full"
                      onClick={() => handleRegister(event.id, event.title)}
                      disabled={isRegistered(event.id)}
                    >
                      {isRegistered(event.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Registered
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
