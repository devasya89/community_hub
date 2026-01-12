import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Edit, Trash2, MoreVertical, Calendar, Clock, MapPin, Users, Image, Upload, Link as LinkIcon, Building2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

// Society-wise events data
const societyEventsData: Record<string, Array<{ id: number; title: string; date: string; time: string; location: string; attendees: number; status: string; image: string }>> = {
  "greenwood-heights": [
    { id: 1, title: "New Year's Eve Celebration", date: "Dec 31, 2024", time: "8:00 PM - 1:00 AM", location: "Community Hall", attendees: 120, status: "upcoming", image: "" },
    { id: 2, title: "Annual Sports Day", date: "Jan 15, 2025", time: "7:00 AM - 5:00 PM", location: "Society Grounds", attendees: 85, status: "upcoming", image: "" },
    { id: 3, title: "Yoga Workshop", date: "Jan 20, 2025", time: "6:00 AM - 8:00 AM", location: "Terrace Garden", attendees: 40, status: "upcoming", image: "" },
  ],
  "sunrise-residency": [
    { id: 1, title: "Cultural Festival", date: "Feb 14, 2025", time: "4:00 PM - 10:00 PM", location: "Amphitheater", attendees: 200, status: "upcoming", image: "" },
    { id: 2, title: "Community BBQ", date: "Feb 20, 2025", time: "5:00 PM - 9:00 PM", location: "Society Grounds", attendees: 75, status: "upcoming", image: "" },
  ],
  "palm-grove-society": [
    { id: 1, title: "Kids Art Competition", date: "Feb 28, 2025", time: "10:00 AM - 2:00 PM", location: "Recreation Room", attendees: 35, status: "upcoming", image: "" },
    { id: 2, title: "Senior Citizens Day", date: "Mar 8, 2025", time: "11:00 AM - 4:00 PM", location: "Community Hall", attendees: 60, status: "upcoming", image: "" },
  ],
};

const AdminEvents = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  const [events, setEvents] = useState<Array<{ id: number; title: string; date: string; time: string; location: string; attendees: number; status: string; image: string }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", description: "", image: "" });

  // Load events based on selected society
  useEffect(() => {
    if (selectedAdminSociety) {
      const societyEvents = societyEventsData[selectedAdminSociety.id] || [];
      setEvents(societyEvents);
    } else {
      setEvents([]);
    }
  }, [selectedAdminSociety]);

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
    setNewEvent({ title: "", date: "", time: "", location: "", description: "", image: "" });
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

  const openPhotoDialog = (eventId: number) => {
    setSelectedEventId(eventId);
    const event = events.find(e => e.id === eventId);
    setPreviewImage(event?.image || "");
    setPhotoUrl(event?.image || "");
    setIsPhotoDialogOpen(true);
  };

  const handleUrlSubmit = () => {
    if (!photoUrl || !selectedEventId) return;
    setEvents(events.map(e => 
      e.id === selectedEventId ? { ...e, image: photoUrl } : e
    ));
    setIsPhotoDialogOpen(false);
    setPhotoUrl("");
    setPreviewImage("");
    toast({ title: "Photo Added", description: "Event photo has been updated." });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "File size must be less than 5MB", variant: "destructive" });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      if (selectedEventId) {
        setEvents(events.map(e => 
          e.id === selectedEventId ? { ...e, image: base64String } : e
        ));
        toast({ title: "Photo Uploaded", description: "Event photo has been updated." });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNewEventFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "File size must be less than 5MB", variant: "destructive" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewEvent({ ...newEvent, image: base64String });
    };
    reader.readAsDataURL(file);
  };

  if (!selectedAdminSociety) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Society Selected</h2>
          <p className="text-muted-foreground">Please select a society from the sidebar to manage events.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Events - {selectedAdminSociety.name}</h1>
            <p className="text-muted-foreground">Manage society events and activities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

                {/* Photo Upload Section for New Event */}
                <div className="space-y-2">
                  <Label>Event Photo</Label>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="upload" className="flex-1 gap-2">
                        <Upload className="w-4 h-4" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex-1 gap-2">
                        <LinkIcon className="w-4 h-4" />
                        URL
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-3">
                      <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-secondary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewEventFileUpload}
                          className="hidden"
                          id="new-event-file"
                        />
                        <label htmlFor="new-event-file" className="cursor-pointer">
                          {newEvent.image ? (
                            <img src={newEvent.image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                          ) : (
                            <div className="py-4">
                              <Image className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload image</p>
                              <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </TabsContent>
                    <TabsContent value="url" className="mt-3">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={newEvent.image}
                        onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                      />
                    </TabsContent>
                  </Tabs>
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
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                        )}
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
                          <DropdownMenuItem onClick={() => openPhotoDialog(event.id)}>
                            <Image className="w-4 h-4 mr-2" />
                            {event.image ? "Change Photo" : "Add Photo"}
                          </DropdownMenuItem>
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

      {/* Photo Upload Dialog */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event Photo</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="upload" className="w-full mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="upload" className="flex-1 gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="url" className="flex-1 gap-2">
                <LinkIcon className="w-4 h-4" />
                Photo URL
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-secondary transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  ) : (
                    <>
                      <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
                <Button 
                  variant="gold" 
                  className="w-full" 
                  onClick={() => setIsPhotoDialogOpen(false)}
                  disabled={!previewImage}
                >
                  Save Photo
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="url" className="mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="https://example.com/event-photo.jpg"
                    value={photoUrl}
                    onChange={(e) => {
                      setPhotoUrl(e.target.value);
                      setPreviewImage(e.target.value);
                    }}
                  />
                </div>
                {previewImage && (
                  <div className="rounded-xl overflow-hidden border border-border">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                      onError={() => setPreviewImage("")}
                    />
                  </div>
                )}
                <Button 
                  variant="gold" 
                  className="w-full" 
                  onClick={handleUrlSubmit}
                  disabled={!photoUrl}
                >
                  Add Photo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
