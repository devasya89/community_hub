import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Trash2, MoreVertical, UserCheck, UserX } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

// Society-wise visitors data
const societyVisitorsData: Record<string, Array<{
  id: number;
  name: string;
  purpose: string;
  flatNo: string;
  checkIn: string;
  checkOut: string;
  date: string;
  status: string;
}>> = {
  "greenwood-heights": [
    { id: 1, name: "John Smith", purpose: "Guest", flatNo: "A-101", checkIn: "10:30 AM", checkOut: "2:00 PM", date: "Jan 10, 2026", status: "checked-out" },
    { id: 2, name: "Sarah Johnson", purpose: "Delivery", flatNo: "B-205", checkIn: "11:00 AM", checkOut: "-", date: "Jan 10, 2026", status: "checked-in" },
    { id: 3, name: "Mike Williams", purpose: "Maintenance", flatNo: "C-302", checkIn: "9:45 AM", checkOut: "-", date: "Jan 10, 2026", status: "checked-in" },
  ],
  "sunrise-residency": [
    { id: 1, name: "Ravi Kumar", purpose: "Guest", flatNo: "A-201", checkIn: "9:00 AM", checkOut: "12:00 PM", date: "Jan 10, 2026", status: "checked-out" },
    { id: 2, name: "Delivery Boy", purpose: "Delivery", flatNo: "B-102", checkIn: "10:30 AM", checkOut: "-", date: "Jan 10, 2026", status: "checked-in" },
  ],
  "palm-grove-society": [
    { id: 1, name: "Security Inspector", purpose: "Inspection", flatNo: "PG-101", checkIn: "8:00 AM", checkOut: "5:00 PM", date: "Jan 10, 2026", status: "checked-out" },
    { id: 2, name: "Electrician Team", purpose: "Maintenance", flatNo: "PG-305", checkIn: "11:00 AM", checkOut: "-", date: "Jan 10, 2026", status: "checked-in" },
    { id: 3, name: "Guest Family", purpose: "Family Visit", flatNo: "PG-402", checkIn: "2:00 PM", checkOut: "-", date: "Jan 10, 2026", status: "checked-in" },
  ],
};

const AdminVisitors = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  
  const initialVisitors = selectedAdminSociety 
    ? societyVisitorsData[selectedAdminSociety.id] || []
    : [];
  
  const [visitors, setVisitors] = useState(initialVisitors);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ name: "", purpose: "", flatNo: "" });

  const filteredVisitors = visitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVisitor = () => {
    if (!newVisitor.name || !newVisitor.purpose || !newVisitor.flatNo) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    const visitor = {
      id: visitors.length + 1,
      ...newVisitor,
      checkIn: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      checkOut: "-",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "checked-in" as const,
    };
    setVisitors([visitor, ...visitors]);
    setNewVisitor({ name: "", purpose: "", flatNo: "" });
    setIsDialogOpen(false);
    toast({ title: "Visitor Added", description: `${visitor.name} has been checked in.` });
  };

  const handleCheckout = (id: number) => {
    setVisitors(
      visitors.map((v) =>
        v.id === id
          ? { ...v, status: "checked-out", checkOut: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) }
          : v
      )
    );
    toast({ title: "Checked Out", description: "Visitor has been checked out successfully." });
  };

  const handleDelete = (id: number) => {
    setVisitors(visitors.filter((v) => v.id !== id));
    toast({ title: "Deleted", description: "Visitor record has been removed." });
  };

  if (!selectedAdminSociety) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a society to view visitors.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Visitors</h1>
            <p className="text-muted-foreground">
              Manage visitor check-ins for {selectedAdminSociety.name}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Visitor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Visitor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Visitor Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input
                      placeholder="Guest, Delivery, etc."
                      value={newVisitor.purpose}
                      onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Visiting Flat</Label>
                    <Input
                      placeholder="A-101"
                      value={newVisitor.flatNo}
                      onChange={(e) => setNewVisitor({ ...newVisitor, flatNo: e.target.value })}
                    />
                  </div>
                </div>
                <Button variant="gold" className="w-full" onClick={handleAddVisitor}>
                  Check In Visitor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search visitors..."
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
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Visitor</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Purpose</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Flat</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Check In</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Check Out</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-right px-6 py-4 font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">{visitor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{visitor.name}</p>
                          <p className="text-xs text-muted-foreground">{visitor.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{visitor.purpose}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{visitor.flatNo}</td>
                    <td className="px-6 py-4 text-muted-foreground">{visitor.checkIn}</td>
                    <td className="px-6 py-4 text-muted-foreground">{visitor.checkOut}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={visitor.status === "checked-in" ? "default" : "secondary"}
                        className={visitor.status === "checked-in" ? "bg-success text-success-foreground" : ""}
                      >
                        {visitor.status === "checked-in" ? (
                          <UserCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <UserX className="w-3 h-3 mr-1" />
                        )}
                        {visitor.status === "checked-in" ? "Inside" : "Left"}
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
                          {visitor.status === "checked-in" && (
                            <DropdownMenuItem onClick={() => handleCheckout(visitor.id)}>
                              <UserX className="w-4 h-4 mr-2" />
                              Check Out
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(visitor.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredVisitors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No visitors found for this society.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
