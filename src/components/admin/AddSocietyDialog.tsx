import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Plus, X, Image, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSocieties } from "@/contexts/SocietyContext";

interface AddSocietyDialogProps {
  onSocietyAdded?: () => void;
}

const AddSocietyDialog = ({ onSocietyAdded }: AddSocietyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addSociety } = useSocieties();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate a slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const newSociety = {
      id: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name.trim(),
      address: formData.address.trim(),
      image: formData.image.trim() || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      amenities: [],
      events: [],
      emergencyContacts: [],
    };

    addSociety(newSociety);

    toast({
      title: "Society Added",
      description: `${newSociety.name} has been successfully added.`,
    });

    setFormData({ name: "", address: "", image: "" });
    setOpen(false);
    setIsSubmitting(false);
    onSocietyAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gold-gradient text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4" />
          Add Society
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Building className="w-5 h-5 text-secondary" />
            Add New Society
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new society to manage. Only super admins can add societies.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Society Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="e.g., Greenwood Heights"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-background border-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">
              Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="address"
                placeholder="e.g., 123 Green Valley Road, Mumbai"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="pl-10 min-h-[80px] bg-background border-input resize-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-foreground">
              Image URL <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="image"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="pl-10 bg-background border-input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to use a default building image.
            </p>
          </div>

          {/* Preview */}
          {formData.name && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-muted/50 border border-border"
            >
              <p className="text-xs text-muted-foreground mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={formData.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop";
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{formData.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[280px]">
                    {formData.address || "No address provided"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gold-gradient text-primary-foreground hover:opacity-90"
            >
              {isSubmitting ? "Adding..." : "Add Society"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSocietyDialog;
