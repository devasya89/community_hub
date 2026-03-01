import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Wallet,
  Building,
  Banknote,
  Loader2,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSociety } from "@/contexts/SocietyContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceCategory {
  name: string;
  amount: number;
}

const paymentMethods = [
  { value: "UPI", label: "UPI", icon: Wallet },
  { value: "Credit Card", label: "Credit Card", icon: CreditCard },
  { value: "Debit Card", label: "Debit Card", icon: CreditCard },
  { value: "Bank Transfer", label: "Bank Transfer", icon: Building },
  { value: "Cash", label: "Cash", icon: Banknote },
];

const Maintenance = () => {
  const navigate = useNavigate();
  const { selectedSociety, isLoggedIn } = useSociety();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  if (!isLoggedIn || !selectedSociety) {
    navigate("/select-society");
    return null;
  }

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['maintenance', user?.id, selectedSociety.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('user_id', user!.id)
        .eq('society_id', selectedSociety.id)
        .order('due_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!selectedSociety,
  });

  const payMutation = useMutation({
    mutationFn: async ({ recordId, method }: { recordId: string; method: string }) => {
      const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const paymentDate = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('maintenance_records')
        .update({
          status: 'paid' as any,
          payment_date: paymentDate,
          payment_method: method,
          receipt_number: receiptNumber,
        })
        .eq('id', recordId);
      if (error) throw error;
      return { receiptNumber, paymentDate, method };
    },
    onSuccess: async (result) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: "Payment Successful!", description: "Payment recorded. Sending invoice to your email..." });

      // Send invoice email
      if (selectedRecord && user?.email) {
        const categories = getCategories(selectedRecord);
        try {
          await supabase.functions.invoke('send-maintenance-invoice', {
            body: {
              recipientEmail: user.email,
              recipientName: selectedRecord.resident_name,
              societyName: selectedSociety?.name || '',
              unitNumber: selectedRecord.unit_number,
              month: selectedRecord.month,
              amount: Number(selectedRecord.amount),
              penalty: Number(selectedRecord.penalty),
              categories,
              paymentMethod: result.method,
              paymentDate: new Date(result.paymentDate).toLocaleDateString('en-IN'),
              receiptNumber: result.receiptNumber,
            },
          });
          toast({ title: "Invoice Sent!", description: "Invoice has been sent to your email." });
        } catch {
          toast({ title: "Invoice email failed", description: "Payment was recorded but invoice email could not be sent.", variant: "destructive" });
        }
      }

      setPayDialogOpen(false);
      setSelectedRecord(null);
      setPaymentMethod("");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filtered = filter === "all" ? records : records.filter(r => r.status === filter);

  const totalDue = records
    .filter(r => r.status !== "paid")
    .reduce((sum, r) => sum + Number(r.amount) + Number(r.penalty), 0);

  const paidCount = records.filter(r => r.status === "paid").length;
  const pendingCount = records.filter(r => r.status === "pending").length;
  const overdueCount = records.filter(r => r.status === "overdue").length;

  const handlePay = () => {
    if (!selectedRecord || !paymentMethod) {
      toast({ title: "Error", description: "Please select a payment method", variant: "destructive" });
      return;
    }
    payMutation.mutate({ recordId: selectedRecord.id, method: paymentMethod });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid": return { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle2 };
      case "pending": return { color: "bg-amber-500/10 text-amber-600 border-amber-500/30", icon: Clock };
      case "overdue": return { color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertTriangle };
      default: return { color: "bg-muted text-muted-foreground", icon: Clock };
    }
  };

  const getCategories = (record: any): MaintenanceCategory[] => {
    try {
      if (Array.isArray(record.categories)) return record.categories;
      return [];
    } catch { return []; }
  };

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false} showChatbot>
      <div className="min-h-screen bg-muted/30 py-4 md:py-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-1">Maintenance</h1>
            <p className="text-muted-foreground">View and pay your society maintenance dues</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="glass-card p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Total Due</p>
              <p className="text-xl font-bold text-foreground flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />{totalDue.toLocaleString()}
              </p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Paid</p>
              <p className="text-xl font-bold text-emerald-600">{paidCount}</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <p className="text-xs text-muted-foreground mb-1">Overdue</p>
              <p className="text-xl font-bold text-destructive">{overdueCount}</p>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {(["all", "pending", "overdue", "paid"] as const).map(f => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize whitespace-nowrap">
                {f}
              </Button>
            ))}
          </div>

          {/* Records */}
          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((record, index) => {
                const statusConfig = getStatusConfig(record.status);
                const StatusIcon = statusConfig.icon;
                const isExpanded = expandedId === record.id;
                const categories = getCategories(record);
                const amount = Number(record.amount);
                const penalty = Number(record.penalty);

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="glass-card rounded-xl border border-border/50 overflow-hidden"
                  >
                    <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : record.id)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-foreground text-sm">{record.month}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {record.status}
                          </Badge>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Unit: {record.unit_number}</p>
                          <p className="text-xs text-muted-foreground">Due: {new Date(record.due_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground flex items-center gap-0.5">
                            <IndianRupee className="w-4 h-4" />{amount.toLocaleString()}
                          </p>
                          {penalty > 0 && <p className="text-xs text-destructive">+ ₹{penalty} penalty</p>}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border/50 px-4 pb-4">
                        {categories.length > 0 && (
                          <>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-2">Category Breakdown</p>
                            <div className="space-y-1.5 mb-3">
                              {categories.map((cat, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{cat.name}</span>
                                  <span className="text-foreground font-medium">₹{cat.amount.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        {penalty > 0 && (
                          <div className="flex justify-between text-sm border-t border-border/50 pt-1.5 mb-1.5">
                            <span className="text-destructive">Late Penalty</span>
                            <span className="text-destructive font-medium">₹{penalty.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm border-t border-border pt-1.5 font-bold mb-3">
                          <span className="text-foreground">Total</span>
                          <span className="text-foreground">₹{(amount + penalty).toLocaleString()}</span>
                        </div>

                        {record.status === "paid" ? (
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 space-y-1">
                            <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-1">
                              <Receipt className="w-4 h-4" /> Payment Details
                            </div>
                            <p className="text-xs text-muted-foreground">Receipt: {record.receipt_number}</p>
                            <p className="text-xs text-muted-foreground">Date: {record.payment_date ? new Date(record.payment_date).toLocaleDateString() : "-"}</p>
                            <p className="text-xs text-muted-foreground">Method: {record.payment_method}</p>
                          </div>
                        ) : (
                          <Button
                            variant="gold"
                            className="w-full gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(record);
                              setPayDialogOpen(true);
                            }}
                          >
                            <IndianRupee className="w-4 h-4" />
                            Pay ₹{(amount + penalty).toLocaleString()}
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="glass-card p-8 rounded-xl text-center">
                <IndianRupee className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">No maintenance records found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Maintenance</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 mt-2">
              <div className="glass-card p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Month</span>
                  <span className="font-medium text-foreground">{selectedRecord.month}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-medium text-foreground">{selectedRecord.unit_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">₹{Number(selectedRecord.amount).toLocaleString()}</span>
                </div>
                {Number(selectedRecord.penalty) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-destructive">Penalty</span>
                    <span className="text-destructive font-medium">₹{Number(selectedRecord.penalty).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-border pt-2 font-bold">
                  <span>Total</span>
                  <span>₹{(Number(selectedRecord.amount) + Number(selectedRecord.penalty)).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(m => (
                      <SelectItem key={m.value} value={m.value}>
                        <div className="flex items-center gap-2">
                          <m.icon className="w-4 h-4" />
                          {m.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="gold" className="w-full gap-2" onClick={handlePay} disabled={payMutation.isPending}>
                {payMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <IndianRupee className="w-4 h-4" />}
                Confirm Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Maintenance;
