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
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Residents",
    value: "524",
    change: "+12",
    changeType: "positive",
    icon: Users,
  },
  {
    title: "Today's Visitors",
    value: "18",
    change: "+5",
    changeType: "positive",
    icon: UserCheck,
  },
  {
    title: "Pending Complaints",
    value: "7",
    change: "-3",
    changeType: "positive",
    icon: MessageSquare,
  },
  {
    title: "Upcoming Events",
    value: "4",
    change: "+2",
    changeType: "neutral",
    icon: Calendar,
  },
];

const recentComplaints = [
  { id: 1, subject: "Water leakage", flat: "A-101", status: "pending", time: "2 hours ago" },
  { id: 2, subject: "Parking issue", flat: "B-205", status: "in-progress", time: "5 hours ago" },
  { id: 3, subject: "Elevator stuck", flat: "C-302", status: "resolved", time: "1 day ago" },
  { id: 4, subject: "Noise complaint", flat: "D-102", status: "pending", time: "1 day ago" },
];

const recentVisitors = [
  { id: 1, name: "John Smith", flat: "A-101", purpose: "Guest", time: "10:30 AM" },
  { id: 2, name: "Sarah Johnson", flat: "B-205", purpose: "Delivery", time: "11:00 AM" },
  { id: 3, name: "Mike Williams", flat: "C-302", purpose: "Maintenance", time: "9:45 AM" },
  { id: 4, name: "Emily Brown", flat: "A-405", purpose: "Family", time: "8:00 AM" },
];

const AdminDashboard = () => {
  const { adminType } = useAdmin();
  const isSuperAdmin = adminType === "super";

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening in your society today.
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
          {stats.map((stat, index) => (
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
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.changeType === "positive"
                      ? "text-success"
                      : stat.changeType === "negative"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : stat.changeType === "negative" ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : null}
                  {stat.change}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{stat.title}</p>
              <p className="font-display text-3xl font-bold text-foreground mt-1">{stat.value}</p>
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
              <h2 className="font-display text-xl font-semibold text-foreground">
                Recent Complaints
              </h2>
              <a href="/admin/complaints" className="text-secondary text-sm hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        complaint.status === "pending"
                          ? "bg-warning/20"
                          : complaint.status === "in-progress"
                          ? "bg-primary/20"
                          : "bg-success/20"
                      }`}
                    >
                      {complaint.status === "resolved" ? (
                        <CheckCircle
                          className={`w-5 h-5 ${
                            complaint.status === "resolved" ? "text-success" : ""
                          }`}
                        />
                      ) : (
                        <AlertCircle
                          className={`w-5 h-5 ${
                            complaint.status === "pending"
                              ? "text-warning"
                              : "text-primary"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{complaint.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.flat} • {complaint.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      complaint.status === "pending"
                        ? "bg-warning/20 text-warning"
                        : complaint.status === "in-progress"
                        ? "bg-primary/20 text-primary"
                        : "bg-success/20 text-success"
                    }`}
                  >
                    {complaint.status.replace("-", " ")}
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
              <h2 className="font-display text-xl font-semibold text-foreground">
                Today's Visitors
              </h2>
              <a href="/admin/visitors" className="text-secondary text-sm hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {recentVisitors.map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{visitor.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {visitor.flat} • {visitor.purpose}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{visitor.time}</span>
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
