import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Trash2, MoreVertical, Phone, AlertTriangle } from "lucide-react";
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

// Society-wise emergency contacts data
const societyEmergencyData: Record<string, Array<{
  id: number;
  name: string;
  role: string;
  phone: string;
  priority: string;
}>> = {
  "greenwood-heights": [
    { id: 1, name: "Security Office", role: "24/7 Security", phone: "+91 98765 43211", priority: "high" },
    { id: 2, name: "Fire Emergency", role: "Fire Department", phone: "101", priority: "high" },
    { id: 3, name: "Medical Emergency", role: "Ambulance", phone: "102", priority: "high" },
    { id: 4, name: "Rajesh Kumar", role: "Society Manager", phone: "+91 98765 43210", priority: "medium" },
    { id: 5, name: "Maintenance Helpdesk", role: "General Maintenance", phone: "+91 98765 43212", priority: "low" },
  ],
  "sunrise-residency": [
    { id: 1, name: "Guard Room", role: "24/7 Security", phone: "+91 98765 11110", priority: "high" },
    { id: 2, name: "Fire Safety", role: "Fire Department", phone: "101", priority: "high" },
    { id: 3, name: "Ambulance", role: "Medical Emergency", phone: "102", priority: "high" },
    { id: 4, name: "Amit Sharma", role: "Society Secretary", phone: "+91 98765 12345", priority: "medium" },
    { id: 5, name: "Electrician", role: "Electrical Issues", phone: "+91 98765 11112", priority: "medium" },
  ],
  "palm-grove-society": [
    { id: 1, name: "Security Control", role: "24/7 Security", phone: "+91 99887 76656", priority: "high" },
    { id: 2, name: "Fire Emergency", role: "Fire Department", phone: "101", priority: "high" },
    { id: 3, name: "Medical Emergency", role: "Ambulance", phone: "108", priority: "high" },
    { id: 4, name: "Police", role: "Local Police", phone: "100", priority: "high" },
    { id: 5, name: "Priya Nair", role: "Property Manager", phone: "+91 99887 76655", priority: "medium" },
    { id: 6, name: "Spa Reception", role: "Wellness Center", phone: "+91 99887 76660", priority: "low" },
  ],
};

const AdminEmergency = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  
  const initialContacts = selectedAdminSociety 
    ? societyEmergencyData[selectedAdminSociety.id] || []
    : [];
  
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "", phone: "", priority: "medium" });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = () => {
    if (!newContact.name || !newContact.role || !newContact.phone) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    const contact = {
      id: contacts.length + 1,
      ...newContact,
    };
    setContacts([...contacts, contact]);
    setNewContact({ name: "", role: "", phone: "", priority: "medium" });
    setIsDialogOpen(false);
    toast({ title: "Contact Added", description: `${contact.name} has been added.` });
  };

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter((c) => c.id !== id));
    toast({ title: "Contact Deleted", description: "Emergency contact has been removed." });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!selectedAdminSociety) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a society to view emergency contacts.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Emergency Contacts</h1>
            <p className="text-muted-foreground">
              Manage emergency contacts for {selectedAdminSociety.name}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    placeholder="Security Office"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role/Service</Label>
                    <Input
                      placeholder="24/7 Security"
                      value={newContact.role}
                      onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex gap-2">
                    {["high", "medium", "low"].map((p) => (
                      <Button
                        key={p}
                        type="button"
                        variant={newContact.priority === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewContact({ ...newContact, priority: p })}
                        className="capitalize"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button variant="gold" className="w-full" onClick={handleAddContact}>
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* High Priority Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h2 className="font-display text-xl font-semibold text-foreground">Emergency Numbers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredContacts
              .filter((c) => c.priority === "high")
              .map((contact) => (
                <div key={contact.id} className="glass-card p-4 rounded-xl border-2 border-destructive/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-destructive" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteContact(contact.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-medium text-foreground">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{contact.role}</p>
                  <a href={`tel:${contact.phone}`} className="font-mono text-lg font-semibold text-destructive hover:underline">
                    {contact.phone}
                  </a>
                </div>
              ))}
            {filteredContacts.filter((c) => c.priority === "high").length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-4">
                No emergency contacts found.
              </div>
            )}
          </div>
        </motion.div>

        {/* Other Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-display text-xl font-semibold text-foreground">Other Important Contacts</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Name</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Role</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Phone</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Priority</th>
                    <th className="text-right px-6 py-4 font-medium text-muted-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredContacts
                    .filter((c) => c.priority !== "high")
                    .map((contact) => (
                      <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{contact.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{contact.role}</td>
                        <td className="px-6 py-4">
                          <a href={`tel:${contact.phone}`} className="font-mono text-foreground hover:text-primary">
                            {contact.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getPriorityColor(contact.priority)}>{contact.priority}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteContact(contact.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  {filteredContacts.filter((c) => c.priority !== "high").length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No other contacts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmergency;
