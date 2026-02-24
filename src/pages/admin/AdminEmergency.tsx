import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Trash2, MoreVertical, Phone, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminEmergency = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", role: "", phone: "" });

  const societyId = selectedAdminSociety?.id;

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin-emergency', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('society_id', societyId!)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!societyId,
  });

  const addContact = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('emergency_contacts').insert({
        name: newContact.name,
        role: newContact.role,
        phone: newContact.phone,
        society_id: societyId!,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-emergency'] });
      toast({ title: "Contact Added", description: `${newContact.name} has been added.` });
      setNewContact({ name: "", role: "", phone: "" });
      setIsDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-emergency'] });
      toast({ title: "Contact Deleted" });
    },
  });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple heuristic: emergency services are high priority
  const isHighPriority = (role: string) => {
    const highRoles = ['security', 'fire', 'ambulance', 'medical', 'police', 'emergency'];
    return highRoles.some(r => role.toLowerCase().includes(r));
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
            <p className="text-muted-foreground">Manage emergency contacts for {selectedAdminSociety.name}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="w-4 h-4" /> Add Contact</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Emergency Contact</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input placeholder="Security Office" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role/Service</Label>
                    <Input placeholder="24/7 Security" value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="+91 98765 43210" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                  </div>
                </div>
                <Button variant="gold" className="w-full" onClick={() => addContact.mutate()} disabled={addContact.isPending || !newContact.name || !newContact.phone}>
                  {addContact.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <>
            {/* High Priority Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="font-display text-xl font-semibold text-foreground">Emergency Numbers</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredContacts.filter(c => isHighPriority(c.role)).map((contact) => (
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
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteContact.mutate(contact.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
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
                {filteredContacts.filter(c => isHighPriority(c.role)).length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground py-4">No emergency contacts found.</div>
                )}
              </div>
            </motion.div>

            {/* Other Contacts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-foreground">Other Important Contacts</h2>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Name</th>
                        <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Role</th>
                        <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Phone</th>
                        <th className="text-right px-6 py-4 font-medium text-muted-foreground text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredContacts.filter(c => !isHighPriority(c.role)).map((contact) => (
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
                            <a href={`tel:${contact.phone}`} className="font-mono text-foreground hover:text-primary">{contact.phone}</a>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-destructive" onClick={() => deleteContact.mutate(contact.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                      {filteredContacts.filter(c => !isHighPriority(c.role)).length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No other contacts found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEmergency;
