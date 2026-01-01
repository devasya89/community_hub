import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Edit, Trash2, MoreVertical, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const initialEvents = [
  { id: 1, title: "New Year's Eve Celebration", date: "Dec 31, 2024", time: "8:00 PM - 1:00 AM", location: "Community Hall", attendees: 120, status: "upcoming" },
  { id: 2, title: "Annual Sports Day", date: "Jan 15, 2025", time: "7:00 AM - 5:00 PM", location: "Society Grounds", attendees: 85, status: "upcoming" },
  { id: 3, title: "Yoga Workshop", date: "Jan 20, 2025", time: "6:00 AM - 8:00 AM", location: "Terrace Garden", attendees: 40, status: "upcoming" },
  { id: 4, title: "Cultural Festival", date: "Feb 14, 2025", time: "4:00 PM - 10:00 PM", location: "Amphitheater", attendees: 200, status: "upcoming" },
  { id: 5, title: "Diwali Celebration", date: "Nov 12, 2024", time: "6:00 PM - 11:00 PM", location: "Community Hall", attendees: 180, status: "completed" },
];

const AdminEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", description: "" });

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const event = {
      id: events.length + 1,
      ...newEvent,
      attendees: 0,
      status: "upcoming" as const,
    };
    setEvents([event, ...events]);
    setNewEvent({ title: "", date: "", time: "", location: "", description: "" });
    setIsDialogOpen(false);
    toast({ title: "Event Created", description: `${event.title} has been added.` });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: "Event Deleted", description: "Event has been removed." });
  };

  const toggleStatus = (id: number) => {
    setEvents(
      events.map((e) =>
        e.id === id ? { ...e, status: e.status === "upcoming" ? "completed" : "upcoming" } : e
      )
    );
    toast({ title: "Status Updated", description: "Event status has been changed." });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Events</h1>
            <p className="text-muted-foreground">Manage society events and activities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input
                    placeholder="Annual Sports Day"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      placeholder="6:00 PM - 10:00 PM"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Community Hall"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Event description..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                <Button variant="gold" className="w-full" onClick={handleAddEvent}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Event</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Date & Time</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Location</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Attendees</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-right px-6 py-4 font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-foreground">{event.date}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {event.attendees}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={event.status === "upcoming" ? "default" : "secondary"}
                        className={event.status === "upcoming" ? "bg-success text-success-foreground" : ""}
                      >
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStatus(event.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
