import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, MoreVertical, Trash2, Edit, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminUsers = () => {
  const { toast } = useToast();
  const { selectedAdminSociety } = useAdmin();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const societyId = selectedAdminSociety?.id;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', societyId],
    queryFn: async () => {
      // Fetch all profiles (all registered users)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, created_at');
      if (profilesError) throw profilesError;

      // Fetch society members for the selected society
      const { data: members } = await supabase
        .from('society_members')
        .select('*')
        .eq('society_id', societyId!);

      const memberMap = new Map(members?.map(m => [m.user_id, m]) || []);

      return (profiles || []).map(p => {
        const membership = memberMap.get(p.id);
        return {
          id: membership?.id || p.id,
          userId: p.id,
          unitNumber: membership?.unit_number || '-',
          isActive: membership?.is_active ?? null,
          joinedAt: membership?.joined_at || p.created_at,
          name: p.full_name || 'Unknown',
          phone: p.phone || '-',
          isMember: !!membership,
        };
      });
    },
    enabled: !!societyId,
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('society_members')
        .update({ is_active: !isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "Status Updated" });
    },
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('society_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: "Member Removed" });
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage residents of {selectedAdminSociety.name}</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">User</th>
                    <th className="text-left px-6 py-4 font-medium text-muted-foreground text-sm">Unit</th>
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
                          <p className="font-medium text-foreground">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{user.unitNumber}</td>
                      <td className="px-6 py-4 text-muted-foreground">{user.phone}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={!user.isMember ? "outline" : user.isActive ? "default" : "secondary"} 
                          className={user.isMember && user.isActive ? "bg-success text-success-foreground" : ""}
                        >
                          {!user.isMember ? "not joined" : user.isActive ? "active" : "inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.isMember ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleStatus.mutate({ id: user.id, isActive: user.isActive! })}>
                                <Edit className="w-4 h-4 mr-2" /> Toggle Status
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => removeMember.mutate(user.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove from Society
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs text-muted-foreground">No membership</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found.</td></tr>
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

export default AdminUsers;
