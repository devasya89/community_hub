import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    title: "New Year's Eve Celebration",
    date: "Dec 31, 2024",
    time: "8:00 PM - 1:00 AM",
    location: "Community Hall",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&h=400&fit=crop",
    status: "upcoming",
    description: "Join us for an evening of music, dance, and celebration as we welcome the new year together!",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    date: "Jan 15, 2025",
    time: "7:00 AM - 5:00 PM",
    location: "Society Grounds",
    attendees: 85,
    image: "https://images.unsplash.com/photo-1461896836934- voices-of-our-planet-VNf0IFr0bLc?w=600&h=400&fit=crop",
    status: "upcoming",
    description: "A fun-filled day of sports activities for all age groups. Register your team now!",
  },
  {
    id: 3,
    title: "Yoga & Wellness Workshop",
    date: "Jan 20, 2025",
    time: "6:00 AM - 8:00 AM",
    location: "Terrace Garden",
    attendees: 40,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    status: "upcoming",
    description: "Start your day with mindfulness and fitness. Expert yoga instructors will guide the session.",
  },
  {
    id: 4,
    title: "Community Cultural Festival",
    date: "Feb 14, 2025",
    time: "4:00 PM - 10:00 PM",
    location: "Amphitheater",
    attendees: 200,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop",
    status: "upcoming",
    description: "Celebrate our diverse community with performances, food stalls, and cultural exhibitions.",
  },
  {
    id: 5,
    title: "Kids Art Competition",
    date: "Feb 28, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Recreation Room",
    attendees: 35,
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop",
    status: "upcoming",
    description: "Let the little artists showcase their creativity. Prizes for all participants!",
  },
  {
    id: 6,
    title: "Senior Citizens Day",
    date: "Mar 8, 2025",
    time: "11:00 AM - 4:00 PM",
    location: "Community Hall",
    attendees: 60,
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
    status: "upcoming",
    description: "A special day dedicated to our respected seniors with entertainment and felicitation.",
  },
];

const Events = () => {
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
              Community Events
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay connected with your community through exciting events and activities.
            </p>
          </motion.div>

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

                  <Button variant="gold" className="w-full">
                    Register Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
