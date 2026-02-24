import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Trash2, MoreVertical, UserCheck, UserX, Loader2, Clock } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminVisitors = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ name: "", purpose: "", phone: "" });

  const societyId = selectedAdminSociety?.id;

  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ['admin-visitors', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('society_id', societyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!societyId,
  });

  const addVisitor = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('visitors').insert({
        visitor_name: newVisitor.name,
        purpose: newVisitor.purpose,
        phone: newVisitor.phone,
        society_id: societyId!,
        user_id: user!.id,
        status: 'checked_in' as any,
        check_in_time: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-visitors'] });
      toast({ title: "Visitor Added", description: "Visitor has been checked in." });
      setNewVisitor({ name: "", purpose: "", phone: "" });
      setIsDialogOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const checkoutVisitor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('visitors')
        .update({ status: 'checked_out' as any, check_out_time: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-visitors'] });
      toast({ title: "Checked Out", description: "Visitor has been checked out." });
    },
  });

  const deleteVisitor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('visitors').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-visitors'] });
      toast({ title: "Deleted", description: "Visitor record removed." });
    },
  });

  const filteredVisitors = visitors.filter(
    (v) =>
      v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.purpose || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.phone || "").includes(searchTerm)
  );

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
            <p className="text-muted-foreground">Manage visitor check-ins for {selectedAdminSociety.name}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2"><Plus className="w-4 h-4" /> Add Visitor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register New Visitor</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Visitor Name</Label>
                  <Input placeholder="John Doe" value={newVisitor.name} onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input placeholder="Guest, Delivery..." value={newVisitor.purpose} onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+91 98765 43210" value={newVisitor.phone} onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })} />
                  </div>
                </div>
                <Button variant="gold" className="w-full" onClick={() => addVisitor.mutate()} disabled={addVisitor.isPending || !newVisitor.name}>
                  {addVisitor.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Check In Visitor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search visitors..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Visitor</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Purpose</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Phone</th>
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
                            <span className="text-primary font-medium">{visitor.visitor_name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{visitor.visitor_name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(visitor.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{visitor.purpose || "-"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{visitor.phone || "-"}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={visitor.status === "checked_in" ? "default" : "secondary"}
                          className={visitor.status === "checked_in" ? "bg-success text-success-foreground" : ""}
                        >
                          {visitor.status === "checked_in" ? <UserCheck className="w-3 h-3 mr-1" /> : visitor.status === "checked_out" ? <UserX className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {visitor.status === "checked_in" ? "Inside" : visitor.status === "checked_out" ? "Left" : "Expected"}
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
                            {visitor.status === "checked_in" && (
                              <DropdownMenuItem onClick={() => checkoutVisitor.mutate(visitor.id)}>
                                <UserX className="w-4 h-4 mr-2" /> Check Out
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteVisitor.mutate(visitor.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredVisitors.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No visitors found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
