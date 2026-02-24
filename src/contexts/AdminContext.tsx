import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Society } from "./SocietyContext";

export type AdminType = "normal" | "super" | null;

interface AdminContextType {
  adminType: AdminType;
  isLoading: boolean;
  assignedSociety: Society | null;
  selectedAdminSociety: Society | null;
  setSelectedAdminSociety: (society: Society | null) => void;
  logout: () => Promise<void>;
  loginAsAdmin: (email: string, password: string, superKey?: string) => Promise<{ success: boolean; error?: string }>;
  canAccessSociety: (societyId: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [adminType, setAdminType] = useState<AdminType>(null);
  const [assignedSociety, setAssignedSociety] = useState<Society | null>(null);
  const [selectedAdminSociety, setSelectedAdminSocietyState] = useState<Society | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminRole();
    } else {
      setAdminType(null);
      setAssignedSociety(null);
      setSelectedAdminSocietyState(null);
      setIsLoading(false);
    }
  }, [user]);

  const checkAdminRole = async () => {
    setIsLoading(true);
    try {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role, society_id')
        .eq('user_id', user!.id);

      const superAdminRole = roles?.find(r => r.role === 'super_admin');
      const adminRole = roles?.find(r => r.role === 'admin');

      if (superAdminRole) {
        setAdminType('super');
        const { data: societies } = await supabase.from('societies').select('*').order('name').limit(1);
        if (societies?.[0]) {
          const s = societies[0];
          setSelectedAdminSocietyState({ id: s.id, name: s.name, address: s.address, slug: s.slug, image: s.image || "" });
        }
      } else if (adminRole && adminRole.society_id) {
        setAdminType('normal');
        const { data: society } = await supabase.from('societies').select('*').eq('id', adminRole.society_id).single();
        if (society) {
          const s = { id: society.id, name: society.name, address: society.address, slug: society.slug, image: society.image || "" };
          setAssignedSociety(s);
          setSelectedAdminSocietyState(s);
        }
      } else {
        setAdminType(null);
      }
    } catch (e) {
      console.error('Error checking admin role:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string, superKey?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) return { success: false, error: signInError.message };

      if (superKey) {
        const { data, error: fnError } = await supabase.functions.invoke('verify-admin', {
          body: { superKey }
        });
        if (fnError) {
          await supabase.auth.signOut();
          return { success: false, error: 'Failed to verify admin key' };
        }
        if (data?.error) {
          await supabase.auth.signOut();
          return { success: false, error: data.error };
        }
      } else {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', currentUser.id);
          const hasAdminRole = roles?.some(r => r.role === 'admin' || r.role === 'super_admin');
          if (!hasAdminRole) {
            await supabase.auth.signOut();
            return { success: false, error: 'You do not have admin privileges' };
          }
        }
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdminType(null);
    setAssignedSociety(null);
    setSelectedAdminSocietyState(null);
  };

  const setSelectedAdminSociety = (society: Society | null) => {
    setSelectedAdminSocietyState(society);
  };

  const canAccessSociety = (societyId: string): boolean => {
    if (adminType === 'super') return true;
    if (adminType === 'normal' && assignedSociety?.id === societyId) return true;
    return false;
  };

  return (
    <AdminContext.Provider
      value={{
        adminType,
        isLoading,
        assignedSociety,
        selectedAdminSociety,
        setSelectedAdminSociety,
        logout,
        loginAsAdmin,
        canAccessSociety,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
