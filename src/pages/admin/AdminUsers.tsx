import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

// Society-wise users data
const societyUsersData: Record<string, Array<{
  id: number;
  name: string;
  email: string;
  flatNo: string;
  phone: string;
  status: string;
}>> = {
  "greenwood-heights": [
    { id: 1, name: "John Doe", email: "john@email.com", flatNo: "A-101", phone: "+91 98765 43210", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@email.com", flatNo: "B-205", phone: "+91 98765 43211", status: "active" },
    { id: 3, name: "Mike Johnson", email: "mike@email.com", flatNo: "C-302", phone: "+91 98765 43212", status: "inactive" },
  ],
  "sunrise-residency": [
    { id: 1, name: "Amit Patel", email: "amit@email.com", flatNo: "A-201", phone: "+91 98765 11111", status: "active" },
    { id: 2, name: "Priya Sharma", email: "priya@email.com", flatNo: "B-102", phone: "+91 98765 22222", status: "active" },
  ],
  "palm-grove-society": [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@email.com", flatNo: "PG-101", phone: "+91 99887 76655", status: "active" },
    { id: 2, name: "Sunita Nair", email: "sunita@email.com", flatNo: "PG-305", phone: "+91 99887 76656", status: "active" },
    { id: 3, name: "Vikram Singh", email: "vikram@email.com", flatNo: "PG-402", phone: "+91 99887 76657", status: "inactive" },
    { id: 4, name: "Meera Iyer", email: "meera@email.com", flatNo: "PG-201", phone: "+91 99887 76658", status: "active" },
  ],
};

const AdminUsers = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  
  const initialUsers = selectedAdminSociety 
    ? societyUsersData[selectedAdminSociety.id] || []
    : [];
  
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", flatNo: "", phone: "" });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.flatNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.flatNo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
      status: "active" as const,
    };
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", flatNo: "", phone: "" });
    setIsDialogOpen(false);
    toast({
      title: "User Added",
      description: `${user.name} has been added successfully.`,
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been removed successfully.",
    });
  };

  const toggleStatus = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );
    toast({
      title: "Status Updated",
      description: "User status has been updated.",
    });
  };

  if (!selectedAdminSociety) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a society to view users.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground">
              Manage residents of {selectedAdminSociety.name}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@email.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Flat Number</Label>
                    <Input
                      placeholder="A-101"
                      value={newUser.flatNo}
                      onChange={(e) => setNewUser({ ...newUser, flatNo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>
                </div>
                <Button variant="gold" className="w-full" onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">User</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Flat</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Phone</th>
                  <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Status</th>
                  <th className="text-right px-6 py-4 font-medium text-muted-foreground text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{user.flatNo}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.phone}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={user.status === "active" ? "bg-success text-success-foreground" : ""}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No users found for this society.
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

export default AdminUsers;
