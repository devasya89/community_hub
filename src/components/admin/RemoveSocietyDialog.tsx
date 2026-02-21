import { useState } from "react";
import { Trash2, Building, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useSocieties, Society } from "@/contexts/SocietyContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RemoveSocietyDialog = () => {
  const [open, setOpen] = useState(false);
  const [societyToDelete, setSocietyToDelete] = useState<Society | null>(null);
  const { societies, removeSociety } = useSocieties();
  const { toast } = useToast();

  const handleDelete = () => {
    if (!societyToDelete) return;
    removeSociety(societyToDelete.id);
    toast({
      title: "Society Removed",
      description: `${societyToDelete.name} has been permanently removed.`,
    });
    setSocietyToDelete(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
            Remove Society
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Remove Society
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a society to permanently remove. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
            {societies.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No societies available.</p>
            ) : (
              societies.map((society) => (
                <div
                  key={society.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={society.image}
                        alt={society.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{society.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[250px]">{society.address}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setSocietyToDelete(society)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                          Confirm Removal
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove <strong>{society.name}</strong>? All data associated with this society will be permanently deleted. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove Society
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemoveSocietyDialog;
