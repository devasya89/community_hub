import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, MoreVertical, MessageSquare, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusMap: Record<string, string> = {
  open: "pending",
  in_progress: "in-progress",
  resolved: "resolved",
  closed: "closed",
};

const AdminComplaints = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const societyId = selectedAdminSociety?.id;

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['admin-complaints', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('society_id', societyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;

      // Fetch profiles for user names
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const { data: members } = await supabase
        .from('society_members')
        .select('user_id, unit_number')
        .eq('society_id', societyId!)
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
      const memberMap = new Map(members?.map(m => [m.user_id, m.unit_number]) || []);

      return data.map(c => ({
        ...c,
        userName: profileMap.get(c.user_id) || 'Unknown User',
        flatNo: memberMap.get(c.user_id) || '-',
      }));
    },
    enabled: !!societyId,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('complaints')
        .update({ status: status as any })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      toast({ title: "Status Updated", description: "Complaint status has been changed." });
    },
  });

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.flatNo.toLowerCase().includes(searchTerm.toLowerCase());
    const uiStatus = statusMap[complaint.status] || complaint.status;
    const matchesStatus = filterStatus === "all" || uiStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": case "closed": return <CheckCircle className="w-3 h-3" />;
      case "in_progress": return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": case "closed": return "bg-success/20 text-success";
      case "in_progress": return "bg-warning/20 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!selectedAdminSociety) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a society to view complaints.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Complaints</h1>
            <p className="text-muted-foreground">Manage complaints for {selectedAdminSociety.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Open:</span>
              <Badge variant="outline">{complaints.filter(c => c.status === "open").length}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">In Progress:</span>
              <Badge variant="outline">{complaints.filter(c => c.status === "in_progress").length}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search complaints..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="glass-card p-6 rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-display text-lg font-semibold text-foreground">{complaint.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          {statusMap[complaint.status] || complaint.status}
                        </span>
                        {complaint.category && <Badge variant="outline">{complaint.category}</Badge>}
                        <Badge variant="outline" className="capitalize">{complaint.priority}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{complaint.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From: {complaint.userName}</span>
                        <span>•</span>
                        <span>Flat: {complaint.flatNo}</span>
                        <span>•</span>
                        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus.mutate({ id: complaint.id, status: 'open' })}>
                        <AlertCircle className="w-4 h-4 mr-2" /> Mark Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus.mutate({ id: complaint.id, status: 'in_progress' })}>
                        <Clock className="w-4 h-4 mr-2" /> Mark In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus.mutate({ id: complaint.id, status: 'resolved' })}>
                        <CheckCircle className="w-4 h-4 mr-2" /> Mark Resolved
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {filteredComplaints.length === 0 && (
              <div className="glass-card p-8 rounded-2xl text-center text-muted-foreground">
                No complaints found for this society.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminComplaints;
