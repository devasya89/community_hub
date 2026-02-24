import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Search, UserCheck, UserX, Clock, Calendar, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSociety } from "@/contexts/SocietyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Visitors = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ name: "", purpose: "", phone: "", expectedDate: "" });

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ['visitors', user?.id, selectedSociety.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('user_id', user!.id)
        .eq('society_id', selectedSociety.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!selectedSociety,
  });

  const addVisitor = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('visitors').insert({
        user_id: user!.id,
        society_id: selectedSociety.id,
        visitor_name: newVisitor.name,
        purpose: newVisitor.purpose,
        phone: newVisitor.phone,
        expected_date: newVisitor.expectedDate || null,
        status: 'expected',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      toast({ title: "Visitor Added", description: "Visitor has been registered." });
      setNewVisitor({ name: "", purpose: "", phone: "", expectedDate: "" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visitor.purpose || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = visitors.filter((v) => v.status === "checked_in").length;
  const todayStr = new Date().toISOString().split('T')[0];
  const totalToday = visitors.filter((v) => v.created_at.startsWith(todayStr)).length;

  return (
    <Layout showChatbot>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              {selectedSociety.name}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Visitor <span className="gradient-text">Log</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Track all visitors entering and exiting the society premises.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Currently Inside</p>
                  <p className="font-display text-2xl font-bold text-foreground">{checkedInCount}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Today's Visitors</p>
                  <p className="font-display text-2xl font-bold text-foreground">{totalToday}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Records</p>
                  <p className="font-display text-2xl font-bold text-foreground">{visitors.length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search + Add */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex gap-4 items-center"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
                  <DialogTitle>Register Expected Visitor</DialogTitle>
                </DialogHeader>
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
                  <div className="space-y-2">
                    <Label>Expected Date</Label>
                    <Input type="date" value={newVisitor.expectedDate} onChange={(e) => setNewVisitor({ ...newVisitor, expectedDate: e.target.value })} />
                  </div>
                  <Button variant="gold" className="w-full" onClick={() => addVisitor.mutate()} disabled={addVisitor.isPending || !newVisitor.name}>
                    {addVisitor.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Register Visitor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Visitor Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Visitor</th>
                      <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Purpose</th>
                      <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Phone</th>
                      <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Date</th>
                      <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {visitor.visitor_name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{visitor.visitor_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{visitor.purpose || "-"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{visitor.phone || "-"}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {visitor.expected_date ? new Date(visitor.expected_date).toLocaleDateString() : new Date(visitor.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={visitor.status === "checked_in" ? "default" : "secondary"}
                            className={visitor.status === "checked_in" ? "bg-success text-success-foreground" : ""}
                          >
                            {visitor.status === "checked_in" ? (
                              <UserCheck className="w-3 h-3 mr-1" />
                            ) : visitor.status === "checked_out" ? (
                              <UserX className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {visitor.status === "checked_in" ? "Inside" : visitor.status === "checked_out" ? "Left" : "Expected"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {filteredVisitors.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No visitors found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Visitors;
