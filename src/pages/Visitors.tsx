import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Search, UserCheck, UserX, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSociety } from "@/contexts/SocietyContext";
import { Navigate } from "react-router-dom";

// Sample visitor data - in production this would come from the society context/database
const visitorData = [
  {
    id: 1,
    name: "John Smith",
    purpose: "Family Visit",
    flatNo: "A-101",
    checkIn: "10:30 AM",
    checkOut: "2:00 PM",
    date: "Dec 28, 2024",
    status: "checked-out",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    purpose: "Delivery",
    flatNo: "B-205",
    checkIn: "11:00 AM",
    checkOut: "-",
    date: "Dec 29, 2024",
    status: "checked-in",
  },
  {
    id: 3,
    name: "Mike Williams",
    purpose: "Guest",
    flatNo: "C-302",
    checkIn: "9:45 AM",
    checkOut: "12:30 PM",
    date: "Dec 29, 2024",
    status: "checked-out",
  },
  {
    id: 4,
    name: "Emily Brown",
    purpose: "Maintenance",
    flatNo: "A-405",
    checkIn: "8:00 AM",
    checkOut: "-",
    date: "Dec 29, 2024",
    status: "checked-in",
  },
  {
    id: 5,
    name: "David Lee",
    purpose: "Contractor",
    flatNo: "D-102",
    checkIn: "7:30 AM",
    checkOut: "5:00 PM",
    date: "Dec 28, 2024",
    status: "checked-out",
  },
];

const Visitors = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const [searchTerm, setSearchTerm] = useState("");

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const filteredVisitors = visitorData.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedInCount = visitorData.filter((v) => v.status === "checked-in").length;
  const totalToday = visitorData.filter((v) => v.date === "Dec 29, 2024").length;

  return (
    <Layout>
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
                  <p className="font-display text-2xl font-bold text-foreground">{visitorData.length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, flat, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Visitor Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Visitor</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Purpose</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Flat No.</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Check In</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Check Out</th>
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
                              {visitor.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{visitor.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{visitor.purpose}</td>
                      <td className="px-6 py-4 text-foreground font-medium">{visitor.flatNo}</td>
                      <td className="px-6 py-4 text-muted-foreground">{visitor.checkIn}</td>
                      <td className="px-6 py-4 text-muted-foreground">{visitor.checkOut}</td>
                      <td className="px-6 py-4 text-muted-foreground">{visitor.date}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={visitor.status === "checked-in" ? "default" : "secondary"}
                          className={visitor.status === "checked-in" ? "bg-success text-success-foreground" : ""}
                        >
                          {visitor.status === "checked-in" ? (
                            <UserCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <UserX className="w-3 h-3 mr-1" />
                          )}
                          {visitor.status === "checked-in" ? "Inside" : "Left"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Visitors;
