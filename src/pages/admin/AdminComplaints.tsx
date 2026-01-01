import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, MoreVertical, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const initialComplaints = [
  { id: 1, subject: "Water leakage in bathroom", category: "Maintenance", flatNo: "A-101", user: "John Doe", date: "Dec 27, 2024", status: "in-progress", description: "There's a water leak from the ceiling in the master bathroom." },
  { id: 2, subject: "Parking spot occupied", category: "Parking", flatNo: "B-205", user: "Jane Smith", date: "Dec 25, 2024", status: "resolved", description: "Someone is regularly parking in my designated spot A-15." },
  { id: 3, subject: "Elevator not working", category: "Maintenance", flatNo: "C-302", user: "Mike Johnson", date: "Dec 28, 2024", status: "pending", description: "The elevator in Tower B has been out of service since morning." },
  { id: 4, subject: "Noisy neighbors", category: "Noise", flatNo: "D-102", user: "Sarah Williams", date: "Dec 29, 2024", status: "pending", description: "Loud music every night after 11 PM from flat D-103." },
  { id: 5, subject: "Street lights not working", category: "Maintenance", flatNo: "A-405", user: "Tom Brown", date: "Dec 26, 2024", status: "resolved", description: "Three street lights near parking area B are not functioning." },
];

const AdminComplaints = () => {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState(initialComplaints);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.flatNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id: number, newStatus: string) => {
    setComplaints(
      complaints.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    toast({ title: "Status Updated", description: `Complaint status changed to ${newStatus}.` });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-3 h-3" />;
      case "in-progress":
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-success/20 text-success";
      case "in-progress":
        return "bg-warning/20 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Complaints</h1>
            <p className="text-muted-foreground">Manage and resolve resident complaints</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Pending:</span>
              <Badge variant="outline">{complaints.filter((c) => c.status === "pending").length}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">In Progress:</span>
              <Badge variant="outline">{complaints.filter((c) => c.status === "in-progress").length}</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="glass-card p-6 rounded-2xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {complaint.subject}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status.replace("-", " ")}
                      </span>
                      <Badge variant="outline">{complaint.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>From: {complaint.user}</span>
                      <span>•</span>
                      <span>Flat: {complaint.flatNo}</span>
                      <span>•</span>
                      <span>{complaint.date}</span>
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
                    <DropdownMenuItem onClick={() => updateStatus(complaint.id, "pending")}>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Mark Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(complaint.id, "in-progress")}>
                      <Clock className="w-4 h-4 mr-2" />
                      Mark In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(complaint.id, "resolved")}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminComplaints;
