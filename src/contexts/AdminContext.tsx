import { createContext, useContext, useState, ReactNode } from "react";
import { Society, useSocieties } from "./SocietyContext";

// The super key - in production this should be stored securely server-side
const SUPER_ADMIN_KEY = "SOCIETYHUB_SUPER_2024";

export type AdminType = "normal" | "super" | null;

interface AdminContextType {
  adminType: AdminType;
  setAdminType: (type: AdminType) => void;
  assignedSociety: Society | null;
  setAssignedSociety: (society: Society | null) => void;
  selectedAdminSociety: Society | null;
  setSelectedAdminSociety: (society: Society | null) => void;
  validateSuperKey: (key: string) => boolean;
  logout: () => void;
  canAccessSociety: (societyId: string) => boolean;
  getAccessibleSocieties: () => Society[];
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
    if (type) {
      localStorage.setItem("adminType", type);
    } else {
      localStorage.removeItem("adminType");
    }
  };

  const setAssignedSociety = (society: Society | null) => {
    setAssignedSocietyState(society);
    if (society) {
      localStorage.setItem("assignedSociety", JSON.stringify(society));
      // For normal admin, the selected society is always their assigned society
      setSelectedAdminSociety(society);
    } else {
      localStorage.removeItem("assignedSociety");
    }
  };

  const setSelectedAdminSociety = (society: Society | null) => {
    setSelectedAdminSocietyState(society);
    if (society) {
      localStorage.setItem("selectedAdminSociety", JSON.stringify(society));
    } else {
      localStorage.removeItem("selectedAdminSociety");
    }
  };

  const validateSuperKey = (key: string): boolean => {
    return key === SUPER_ADMIN_KEY;
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

  const getAccessibleSocieties = (): Society[] => {
    // Note: This will be called within the provider tree, so useSocieties is available
    // For super admin, return all societies; for normal admin, return their assigned society
    if (adminType === "super") {
      // We need to get societies from the parent context - this will be handled at component level
      return [];
    }
    if (adminType === "normal" && assignedSociety) return [assignedSociety];
    return [];
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
        validateSuperKey,
        logout,
        canAccessSociety,
        getAccessibleSocieties,
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
