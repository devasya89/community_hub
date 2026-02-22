import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Society {
  id: string;
  name: string;
  address: string;
  image: string;
  slug: string;
}

// Societies context for managing the list of societies
interface SocietiesContextType {
  societies: Society[];
  isLoading: boolean;
  addSociety: (society: Omit<Society, "id">) => Promise<void>;
  removeSociety: (societyId: string) => Promise<void>;
}

interface SocietyContextType {
  selectedSociety: Society | null;
  selectSociety: (society: Society) => void;
  clearSociety: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: "user" | "admin" | null;
  setUserRole: (role: "user" | "admin" | null) => void;
}

const SocietiesContext = createContext<SocietiesContextType | undefined>(undefined);
const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export function SocietyProvider({ children }: { children: ReactNode }) {
  const [societiesList, setSocietiesList] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSociety, setSelectedSociety] = useState<Society | null>(() => {
    const stored = localStorage.getItem("selectedSociety");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(() => {
    const stored = localStorage.getItem("userRole");
    return stored as "user" | "admin" | null;
  });

  // Fetch societies from database
  useEffect(() => {
    const fetchSocieties = async () => {
      const { data, error } = await supabase
        .from("societies")
        .select("id, slug, name, address, image")
        .order("name");

      if (!error && data) {
        setSocietiesList(data.map(s => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          address: s.address,
          image: s.image || "",
        })));
      }
      setIsLoading(false);
    };
    fetchSocieties();
  }, []);

  const addSociety = async (society: Omit<Society, "id">) => {
    const { data, error } = await supabase
      .from("societies")
      .insert({ slug: society.slug, name: society.name, address: society.address, image: society.image })
      .select()
      .single();

    if (!error && data) {
      setSocietiesList(prev => [...prev, { id: data.id, slug: data.slug, name: data.name, address: data.address, image: data.image || "" }]);
    }
  };

  const removeSociety = async (societyId: string) => {
    const { error } = await supabase.from("societies").delete().eq("id", societyId);
    if (!error) {
      setSocietiesList(prev => prev.filter(s => s.id !== societyId));
      if (selectedSociety?.id === societyId) {
        clearSociety();
      }
    }
  };

  const selectSociety = (society: Society) => {
    setSelectedSociety(society);
    localStorage.setItem("selectedSociety", JSON.stringify(society));
  };

  const clearSociety = () => {
    setSelectedSociety(null);
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("selectedSociety");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
  };

  const handleSetIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    localStorage.setItem("isLoggedIn", String(value));
  };

  const handleSetUserRole = (role: "user" | "admin" | null) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem("userRole", role);
    } else {
      localStorage.removeItem("userRole");
    }
  };

  return (
    <SocietiesContext.Provider value={{ societies: societiesList, isLoading, addSociety, removeSociety }}>
      <SocietyContext.Provider
        value={{
          selectedSociety,
          selectSociety,
          clearSociety,
          isLoggedIn,
          setIsLoggedIn: handleSetIsLoggedIn,
          userRole,
          setUserRole: handleSetUserRole,
        }}
      >
        {children}
      </SocietyContext.Provider>
    </SocietiesContext.Provider>
  );
}

export function useSociety() {
  const context = useContext(SocietyContext);
  if (context === undefined) {
    throw new Error("useSociety must be used within a SocietyProvider");
  }
  return context;
}

export function useSocieties() {
  const context = useContext(SocietiesContext);
  if (context === undefined) {
    throw new Error("useSocieties must be used within a SocietyProvider");
  }
  return context;
}
