import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import AddSocietyDialog from "@/components/admin/AddSocietyDialog";
import RemoveSocietyDialog from "@/components/admin/RemoveSocietyDialog";
import {
  Users,
  Calendar,
  MessageSquare,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { adminType, selectedAdminSociety } = useAdmin();
  const isSuperAdmin = adminType === "super";
  const societyId = selectedAdminSociety?.id;

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats', societyId],
    queryFn: async () => {
      const [membersRes, visitorsRes, complaintsRes, eventsRes] = await Promise.all([
        supabase.from('society_members').select('id', { count: 'exact', head: true }).eq('society_id', societyId!),
        supabase.from('visitors').select('id', { count: 'exact', head: true }).eq('society_id', societyId!).eq('status', 'checked_in'),
        supabase.from('complaints').select('id', { count: 'exact', head: true }).eq('society_id', societyId!).in('status', ['open', 'in_progress']),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('society_id', societyId!).eq('status', 'upcoming'),
      ]);

      return {
        totalResidents: membersRes.count || 0,
        activeVisitors: visitorsRes.count || 0,
        pendingComplaints: complaintsRes.count || 0,
        upcomingEvents: eventsRes.count || 0,
      };
    },
    enabled: !!societyId,
  });

  const { data: recentComplaints = [] } = useQuery({
    queryKey: ['admin-dashboard-complaints', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('id, title, status, created_at')
        .eq('society_id', societyId!)
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!societyId,
  });

  const { data: recentVisitors = [] } = useQuery({
    queryKey: ['admin-dashboard-visitors', societyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('id, visitor_name, purpose, check_in_time')
        .eq('society_id', societyId!)
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!societyId,
  });

  const statCards = [
    { title: "Total Residents", value: stats?.totalResidents ?? "-", icon: Users },
    { title: "Active Visitors", value: stats?.activeVisitors ?? "-", icon: UserCheck },
    { title: "Pending Complaints", value: stats?.pendingComplaints ?? "-", icon: MessageSquare },
    { title: "Upcoming Events", value: stats?.upcomingEvents ?? "-", icon: Calendar },
  ];

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {selectedAdminSociety ? `Overview for ${selectedAdminSociety.name}` : "Welcome back!"}
            </p>
          </div>
          {isSuperAdmin && (
            <div className="flex gap-3">
              <AddSocietyDialog />
              <RemoveSocietyDialog />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
              <p className="font-display text-3xl font-bold text-foreground mt-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Recent Complaints</h2>
              <a href="/admin/complaints" className="text-secondary text-sm hover:underline">View all</a>
            </div>
            <div className="space-y-4">
              {recentComplaints.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No complaints yet.</p>
              ) : recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      complaint.status === "open" ? "bg-warning/20" : complaint.status === "in_progress" ? "bg-primary/20" : "bg-success/20"
                    }`}>
                      {complaint.status === "resolved" || complaint.status === "closed" ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${complaint.status === "open" ? "text-warning" : "text-primary"}`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{complaint.title}</p>
                      <p className="text-sm text-muted-foreground">{getTimeAgo(complaint.created_at)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    complaint.status === "open" ? "bg-warning/20 text-warning" :
                    complaint.status === "in_progress" ? "bg-primary/20 text-primary" :
                    "bg-success/20 text-success"
                  }`}>
                    {complaint.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Recent Visitors</h2>
              <a href="/admin/visitors" className="text-secondary text-sm hover:underline">View all</a>
            </div>
            <div className="space-y-4">
              {recentVisitors.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No visitors yet.</p>
              ) : recentVisitors.map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{visitor.visitor_name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{visitor.visitor_name}</p>
                      <p className="text-sm text-muted-foreground">{visitor.purpose || "Visitor"}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
