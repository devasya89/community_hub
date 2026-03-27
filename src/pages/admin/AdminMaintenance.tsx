import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  IndianRupee, Search, CheckCircle2, Clock, AlertTriangle,
  Filter, TrendingUp, Users, Building2, Loader2, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/contexts/AdminContext";
import { useSocieties } from "@/contexts/SocietyContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateMaintenanceDialog } from "@/components/admin/CreateMaintenanceDialog";

const AdminMaintenance = () => {
  const { adminType, selectedAdminSociety } = useAdmin();
  const { societies } = useSocieties();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [societyFilter, setSocietyFilter] = useState<string>("all");

  const effectiveSocietyId = adminType === "super"
    ? (societyFilter === "all" ? null : societyFilter)
    : selectedAdminSociety?.id;

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['admin-maintenance', effectiveSocietyId, adminType],
    queryFn: async () => {
      let query = supabase.from('maintenance_records').select('*').order('due_date', { ascending: false });
      if (effectiveSocietyId) query = query.eq('society_id', effectiveSocietyId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: adminType === "super" || !!selectedAdminSociety,
  });

  const markPaid = useMutation({
    mutationFn: async (recordId: string) => {
      const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const { error } = await supabase.from('maintenance_records').update({
        status: 'paid' as any,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Admin Override',
        receipt_number: receiptNumber,
      }).eq('id', recordId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: "Marked as Paid" });
    },
  });

  const deleteRecord = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase.from('maintenance_records').delete().eq('id', recordId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: "Record deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.resident_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = records.filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalPending = records.filter(r => r.status !== "paid").reduce((s, r) => s + Number(r.amount) + Number(r.penalty), 0);
  const totalResidents = new Set(records.map(r => r.unit_number)).size;
  const collectionRate = records.length > 0
    ? Math.round((records.filter(r => r.status === "paid").length / records.length) * 100) : 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid": return { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 };
      case "pending": return { color: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: Clock };
      case "overdue": return { color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle };
      default: return { color: "bg-muted text-muted-foreground", icon: Clock };
    }
  };

  const getSocietyName = (id: string) => societies.find(s => s.id === id)?.name || id;

  if (!selectedAdminSociety && adminType !== "super") {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a society to view maintenance data.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Maintenance</h1>
            <p className="text-muted-foreground">
              {adminType === "super" ? "All societies maintenance overview" : `Maintenance for ${selectedAdminSociety?.name}`}
            </p>
          </div>
          <CreateMaintenanceDialog
            societies={societies}
            adminType={adminType}
            selectedSocietyId={selectedAdminSociety?.id}
          />
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalCollected.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Collected</p>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{totalPending.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Pending</p>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalResidents}</p>
            <p className="text-xs text-muted-foreground">Total Units</p>
          </div>
          <div className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{collectionRate}%</p>
            <p className="text-xs text-muted-foreground">Collection Rate</p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search by name, unit, or month..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          {adminType === "super" && (
            <Select value={societyFilter} onValueChange={setSocietyFilter}>
              <SelectTrigger className="w-52">
                <Building2 className="w-4 h-4 mr-2" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Societies</SelectItem>
                {societies.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {adminType === "super" && <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Society</th>}
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Unit</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Resident</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Month</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Penalty</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Due Date</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(record => {
                    const sc = getStatusConfig(record.status);
                    const SIcon = sc.icon;
                    return (
                      <tr key={record.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        {adminType === "super" && (
                          <td className="p-4 text-sm text-foreground">{getSocietyName(record.society_id)}</td>
                        )}
                        <td className="p-4 text-sm font-medium text-foreground">{record.unit_number}</td>
                        <td className="p-4 text-sm text-foreground">{record.resident_name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{record.month}</td>
                        <td className="p-4 text-sm font-medium text-foreground">₹{Number(record.amount).toLocaleString()}</td>
                        <td className="p-4 text-sm text-destructive">{Number(record.penalty) > 0 ? `₹${Number(record.penalty)}` : "-"}</td>
                        <td className="p-4 text-sm text-muted-foreground">{new Date(record.due_date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={sc.color}>
                            <SIcon className="w-3 h-3 mr-1" />{record.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {record.status !== "paid" ? (
                              <Button size="sm" variant="outline" onClick={() => markPaid.mutate(record.id)} disabled={markPaid.isPending}>
                                Mark Paid
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">{record.payment_method}</span>
                            )}
                            {adminType === "super" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm("Delete this maintenance record?")) {
                                    deleteRecord.mutate(record.id);
                                  }
                                }}
                                disabled={deleteRecord.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={adminType === "super" ? 9 : 8} className="p-8 text-center text-muted-foreground">
                        No maintenance records found.
                      </td>
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

export default AdminMaintenance;
