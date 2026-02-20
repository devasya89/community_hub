import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  IndianRupee,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  TrendingUp,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdmin } from "@/contexts/AdminContext";
import { useSocieties } from "@/contexts/SocietyContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useToast } from "@/hooks/use-toast";

const AdminMaintenance = () => {
  const { adminType, selectedAdminSociety, assignedSociety } = useAdmin();
  const { societies } = useSocieties();
  const { records, payMaintenance, getRecordsBySociety, getAllRecords } = useMaintenance();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [societyFilter, setSocietyFilter] = useState<string>("all");

  // Get records based on admin type
  const baseRecords = adminType === "super"
    ? (societyFilter === "all" ? getAllRecords() : getRecordsBySociety(societyFilter))
    : selectedAdminSociety
      ? getRecordsBySociety(selectedAdminSociety.id)
      : [];

  const filteredRecords = baseRecords.filter(r => {
    const matchesSearch =
      r.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.month.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalCollected = baseRecords.filter(r => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const totalPending = baseRecords.filter(r => r.status !== "paid").reduce((s, r) => s + r.amount + r.penalty, 0);
  const totalResidents = new Set(baseRecords.map(r => r.unitNumber)).size;
  const collectionRate = baseRecords.length > 0
    ? Math.round((baseRecords.filter(r => r.status === "paid").length / baseRecords.length) * 100)
    : 0;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid": return { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 };
      case "pending": return { color: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: Clock };
      case "overdue": return { color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle };
      default: return { color: "bg-muted text-muted-foreground", icon: Clock };
    }
  };

  const getSocietyName = (id: string) => societies.find(s => s.id === id)?.name || id;

  const handleMarkPaid = (recordId: string) => {
    payMaintenance(recordId, "Admin Override");
    toast({ title: "Marked as Paid", description: "Maintenance record updated." });
  };

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Maintenance</h1>
            <p className="text-muted-foreground">
              {adminType === "super" ? "All societies maintenance overview" : `Maintenance for ${selectedAdminSociety?.name}`}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Export", description: "Feature coming with backend integration." })}>
            <Download className="w-4 h-4" />
            Export Data
          </Button>
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
            <Input
              placeholder="Search by name, unit, or month..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
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
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue />
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
                        <td className="p-4 text-sm text-foreground">{getSocietyName(record.societyId)}</td>
                      )}
                      <td className="p-4 text-sm font-medium text-foreground">{record.unitNumber}</td>
                      <td className="p-4 text-sm text-foreground">{record.residentName}</td>
                      <td className="p-4 text-sm text-muted-foreground">{record.month}</td>
                      <td className="p-4 text-sm font-medium text-foreground">₹{record.amount.toLocaleString()}</td>
                      <td className="p-4 text-sm text-destructive">{record.penalty > 0 ? `₹${record.penalty}` : "-"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{record.dueDate}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={sc.color}>
                          <SIcon className="w-3 h-3 mr-1" />
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {record.status !== "paid" ? (
                          <Button size="sm" variant="outline" onClick={() => handleMarkPaid(record.id)}>
                            Mark Paid
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">{record.paymentMethod}</span>
                        )}
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
      </div>
    </AdminLayout>
  );
};

export default AdminMaintenance;
