import { useState } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  societies: { id: string; name: string }[];
  adminType: string;
  selectedSocietyId?: string;
}

interface Category {
  name: string;
  amount: number;
}

const defaultCategories: Category[] = [
  { name: "Water", amount: 800 },
  { name: "Security", amount: 1200 },
  { name: "Cleaning", amount: 1000 },
  { name: "Common Electricity", amount: 800 },
  { name: "Sinking Fund", amount: 500 },
];

export function CreateMaintenanceDialog({ societies, adminType, selectedSocietyId }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [societyId, setSocietyId] = useState(selectedSocietyId || "");
  const [memberId, setMemberId] = useState("");
  const [month, setMonth] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [penalty, setPenalty] = useState("0");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const { data: members = [] } = useQuery({
    queryKey: ['society-members-for-maintenance', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('society_members')
        .select('user_id, unit_number, profiles:user_id(full_name)')
        .eq('society_id', societyId)
        .eq('is_active', true);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!societyId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const member = members.find((m: any) => m.user_id === memberId);
      if (!member) throw new Error("Select a member");
      if (!month || !dueDate) throw new Error("Fill all fields");

      const totalAmount = categories.reduce((s, c) => s + c.amount, 0);
      const residentName = member.profiles?.full_name || "Resident";

      const { error } = await supabase.from('maintenance_records').insert({
        society_id: societyId,
        user_id: memberId,
        unit_number: member.unit_number,
        resident_name: residentName,
        month,
        amount: totalAmount,
        due_date: dueDate,
        penalty: Number(penalty) || 0,
        categories: categories as any,
        status: 'pending' as any,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: "Maintenance record created" });
      setOpen(false);
      resetForm();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setMemberId("");
    setMonth("");
    setDueDate("");
    setPenalty("0");
    setCategories(defaultCategories);
  };

  const updateCategory = (index: number, field: "name" | "amount", value: string) => {
    setCategories(prev => prev.map((c, i) => i === index ? { ...c, [field]: field === "amount" ? Number(value) || 0 : value } : c));
  };

  const removeCategory = (index: number) => {
    setCategories(prev => prev.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    setCategories(prev => [...prev, { name: "", amount: 0 }]);
  };

  const totalAmount = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Maintenance</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Record</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {adminType === "super" && (
            <div>
              <label className="text-sm font-medium">Society</label>
              <Select value={societyId} onValueChange={(v) => { setSocietyId(v); setMemberId(""); }}>
                <SelectTrigger><SelectValue placeholder="Select society" /></SelectTrigger>
                <SelectContent>
                  {societies.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Member</label>
            <Select value={memberId} onValueChange={setMemberId} disabled={!societyId}>
              <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
              <SelectContent>
                {members.map((m: any) => (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.profiles?.full_name || "Unknown"} - {m.unit_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Month</label>
              <Input placeholder="e.g. April 2026" value={month} onChange={e => setMonth(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Penalty (₹)</label>
            <Input type="number" value={penalty} onChange={e => setPenalty(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Categories</label>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}><Plus className="w-3 h-3 mr-1" />Add</Button>
            </div>
            <div className="space-y-2">
              {categories.map((cat, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="Name" value={cat.name} onChange={e => updateCategory(i, "name", e.target.value)} className="flex-1" />
                  <Input type="number" placeholder="₹" value={cat.amount} onChange={e => updateCategory(i, "amount", e.target.value)} className="w-24" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCategory(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
            <p className="text-sm font-medium mt-2 text-right">Total: ₹{totalAmount.toLocaleString()}</p>
          </div>

          <Button className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
