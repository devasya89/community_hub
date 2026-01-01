import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Edit, Trash2, MoreVertical, Dumbbell, Waves, Car, Trees, Building, Coffee, Wifi, Shield, Sparkles, Gamepad2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const iconOptions = [
  { value: "Dumbbell", label: "Gym", icon: Dumbbell },
  { value: "Waves", label: "Pool", icon: Waves },
  { value: "Car", label: "Parking", icon: Car },
  { value: "Trees", label: "Garden", icon: Trees },
  { value: "Building", label: "Hall", icon: Building },
  { value: "Coffee", label: "Café", icon: Coffee },
  { value: "Wifi", label: "Internet", icon: Wifi },
  { value: "Shield", label: "Security", icon: Shield },
  { value: "Sparkles", label: "Spa", icon: Sparkles },
  { value: "Gamepad2", label: "Games", icon: Gamepad2 },
];

const initialAmenities = [
  { id: 1, name: "Fitness Center", icon: "Dumbbell", category: "Health & Wellness", description: "State-of-the-art gym with modern equipment", status: "active" },
  { id: 2, name: "Swimming Pool", icon: "Waves", category: "Recreation", description: "Olympic-sized pool with separate kids' area", status: "active" },
  { id: 3, name: "Covered Parking", icon: "Car", category: "Convenience", description: "Multi-level secure parking with visitor spots", status: "active" },
  { id: 4, name: "Community Hall", icon: "Building", category: "Community", description: "Spacious venue for events and celebrations", status: "active" },
  { id: 5, name: "Landscaped Gardens", icon: "Trees", category: "Outdoors", description: "Beautifully maintained green spaces", status: "maintenance" },
];

const AdminAmenities = () => {
  const { toast } = useToast();
  const [amenities, setAmenities] = useState(initialAmenities);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAmenity, setNewAmenity] = useState({ name: "", icon: "", category: "", description: "" });

  const filteredAmenities = amenities.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amenity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find((opt) => opt.value === iconName);
    return found ? found.icon : Building;
  };

  const handleAddAmenity = () => {
    if (!newAmenity.name || !newAmenity.icon || !newAmenity.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const amenity = {
      id: amenities.length + 1,
      ...newAmenity,
      status: "active" as const,
    };
    setAmenities([...amenities, amenity]);
    setNewAmenity({ name: "", icon: "", category: "", description: "" });
    setIsDialogOpen(false);
    toast({ title: "Amenity Added", description: `${amenity.name} has been added.` });
  };

  const handleDeleteAmenity = (id: number) => {
    setAmenities(amenities.filter((a) => a.id !== id));
    toast({ title: "Amenity Deleted", description: "Amenity has been removed." });
  };

  const toggleStatus = (id: number) => {
    setAmenities(
      amenities.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "maintenance" : "active" } : a
      )
    );
    toast({ title: "Status Updated", description: "Amenity status has been changed." });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Amenities</h1>
            <p className="text-muted-foreground">Manage society facilities and amenities</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Amenity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Amenity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Amenity Name</Label>
                  <Input
                    placeholder="Swimming Pool"
                    value={newAmenity.name}
                    onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={newAmenity.icon}
                      onValueChange={(value) => setNewAmenity({ ...newAmenity, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="w-4 h-4" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      placeholder="Recreation"
                      value={newAmenity.category}
                      onChange={(e) => setNewAmenity({ ...newAmenity, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the amenity..."
                    value={newAmenity.description}
                    onChange={(e) => setNewAmenity({ ...newAmenity, description: e.target.value })}
                  />
                </div>
                <Button variant="gold" className="w-full" onClick={handleAddAmenity}>
                  Add Amenity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search amenities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAmenities.map((amenity) => {
            const IconComponent = getIconComponent(amenity.icon);
            return (
              <div key={amenity.id} className="glass-card p-6 rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleStatus(amenity.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Toggle Status
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAmenity(amenity.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">{amenity.name}</h3>
                  <Badge
                    variant={amenity.status === "active" ? "default" : "secondary"}
                    className={amenity.status === "active" ? "bg-success text-success-foreground" : "bg-warning/20 text-warning"}
                  >
                    {amenity.status}
                  </Badge>
                </div>
                <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-2">{amenity.category}</p>
                <p className="text-muted-foreground text-sm">{amenity.description}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminAmenities;
