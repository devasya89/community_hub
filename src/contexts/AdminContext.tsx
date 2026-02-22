import { createContext, useContext, useState, ReactNode } from "react";
import { Society } from "./SocietyContext";

export type AdminType = "normal" | "super" | null;

interface AdminContextType {
  adminType: AdminType;
  setAdminType: (type: AdminType) => void;
  assignedSociety: Society | null;
  setAssignedSociety: (society: Society | null) => void;
  selectedAdminSociety: Society | null;
  setSelectedAdminSociety: (society: Society | null) => void;
  logout: () => void;
  canAccessSociety: (societyId: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminType, setAdminTypeState] = useState<AdminType>(() => {
    const stored = localStorage.getItem("adminType");
    return (stored as AdminType) || null;
  });

  const [assignedSociety, setAssignedSocietyState] = useState<Society | null>(() => {
    const stored = localStorage.getItem("assignedSociety");
    return stored ? JSON.parse(stored) : null;
  });

  const [selectedAdminSociety, setSelectedAdminSocietyState] = useState<Society | null>(() => {
    const stored = localStorage.getItem("selectedAdminSociety");
    return stored ? JSON.parse(stored) : null;
  });

  const setAdminType = (type: AdminType) => {
    setAdminTypeState(type);
    if (type) localStorage.setItem("adminType", type);
    else localStorage.removeItem("adminType");
  };

  const setAssignedSociety = (society: Society | null) => {
    setAssignedSocietyState(society);
    if (society) {
      localStorage.setItem("assignedSociety", JSON.stringify(society));
      setSelectedAdminSociety(society);
    } else {
      localStorage.removeItem("assignedSociety");
    }
  };

  const setSelectedAdminSociety = (society: Society | null) => {
    setSelectedAdminSocietyState(society);
    if (society) localStorage.setItem("selectedAdminSociety", JSON.stringify(society));
    else localStorage.removeItem("selectedAdminSociety");
  };

  const logout = () => {
    setAdminTypeState(null);
    setAssignedSocietyState(null);
    setSelectedAdminSocietyState(null);
    localStorage.removeItem("adminType");
    localStorage.removeItem("assignedSociety");
    localStorage.removeItem("selectedAdminSociety");
  };

  const canAccessSociety = (societyId: string): boolean => {
    if (adminType === "super") return true;
    if (adminType === "normal" && assignedSociety?.id === societyId) return true;
    return false;
  };

  return (
    <AdminContext.Provider
      value={{
        adminType,
        setAdminType,
        assignedSociety,
        setAssignedSociety,
        selectedAdminSociety,
        setSelectedAdminSociety,
        logout,
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
