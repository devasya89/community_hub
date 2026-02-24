import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Edit, Trash2, MoreVertical, Dumbbell, Waves, Car, Trees, Building, Coffee, Wifi, Shield, Sparkles, Gamepad2, Loader2 } from "lucide-react";
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
import { useAdmin } from "@/contexts/AdminContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

const AdminAmenities = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAmenity, setNewAmenity] = useState({ name: "", icon: "", category: "", description: "" });

  const societyId = selectedAdminSociety?.id;

  const { data: amenities = [], isLoading } = useQuery({
    queryKey: ['admin-amenities', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .eq('society_id', societyId!)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!societyId,
  });

  const addAmenity = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('amenities').insert({
        name: newAmenity.name,
        icon: newAmenity.icon,
        category: newAmenity.category,
        description: newAmenity.description,
        society_id: societyId!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-amenities'] });
      toast({ title: "Amenity Added", description: `${newAmenity.name} has been added.` });
      setNewAmenity({ name: "", icon: "", category: "", description: "" });
      setIsDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteAmenity = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('amenities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-amenities'] });
      toast({ title: "Amenity Deleted" });
    },
  });

  const filteredAmenities = amenities.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (amenity.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find((opt) => opt.value === iconName);
    return found ? found.icon : Building;
  };

  if (!selectedAdminSociety) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a society to view amenities.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Amenities</h1>
            <p className="text-muted-foreground">Manage facilities for {selectedAdminSociety.name}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="w-4 h-4" /> Add Amenity</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Amenity</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Amenity Name</Label>
                  <Input placeholder="Swimming Pool" value={newAmenity.name} onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select value={newAmenity.icon} onValueChange={(value) => setNewAmenity({ ...newAmenity, icon: value })}>
                      <SelectTrigger><SelectValue placeholder="Select icon" /></SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2"><opt.icon className="w-4 h-4" />{opt.label}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input placeholder="Recreation" value={newAmenity.category} onChange={(e) => setNewAmenity({ ...newAmenity, category: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the amenity..." value={newAmenity.description} onChange={(e) => setNewAmenity({ ...newAmenity, description: e.target.value })} />
                </div>
                <Button variant="gold" className="w-full" onClick={() => addAmenity.mutate()} disabled={addAmenity.isPending || !newAmenity.name}>
                  {addAmenity.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add Amenity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search amenities..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAmenities.map((amenity) => {
              const IconComponent = getIconComponent(amenity.icon || "");
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
                        <DropdownMenuItem className="text-destructive" onClick={() => deleteAmenity.mutate(amenity.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{amenity.name}</h3>
                  {amenity.category && <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-2">{amenity.category}</p>}
                  <p className="text-muted-foreground text-sm">{amenity.description}</p>
                </div>
              );
            })}
            {filteredAmenities.length === 0 && (
              <div className="col-span-full glass-card p-8 rounded-2xl text-center text-muted-foreground">
                No amenities found for this society.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAmenities;
