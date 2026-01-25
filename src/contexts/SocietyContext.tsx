import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Society {
  id: string;
  name: string;
  address: string;
  image: string;
  amenities: Amenity[];
  events: Event[];
  emergencyContacts: EmergencyContact[];
}

export interface Amenity {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  status: string;
  description: string;
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
}

// Societies context for managing the list of societies
interface SocietiesContextType {
  societies: Society[];
  addSociety: (society: Society) => void;
}

// Sample societies data
export const defaultSocieties: Society[] = [
  {
    id: "greenwood-heights",
    name: "Greenwood Heights",
    address: "123 Green Valley Road, Mumbai",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    amenities: [
      { id: "1", icon: "Dumbbell", name: "Fitness Center", description: "State-of-the-art gym with modern equipment", category: "Health & Wellness" },
      { id: "2", icon: "Waves", name: "Swimming Pool", description: "Olympic-sized pool with kids' area", category: "Recreation" },
      { id: "3", icon: "Car", name: "Covered Parking", description: "Multi-level secure parking", category: "Convenience" },
      { id: "4", icon: "Trees", name: "Landscaped Gardens", description: "Beautifully maintained green spaces", category: "Outdoors" },
      { id: "5", icon: "Building", name: "Community Hall", description: "Spacious venue for events", category: "Community" },
    ],
    events: [
      { id: "1", title: "New Year's Eve Celebration", date: "Dec 31, 2024", time: "8:00 PM - 1:00 AM", location: "Community Hall", attendees: 120, image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&h=400&fit=crop", status: "upcoming", description: "Join us for music and celebration!" },
      { id: "2", title: "Yoga Workshop", date: "Jan 20, 2025", time: "6:00 AM - 8:00 AM", location: "Terrace Garden", attendees: 40, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop", status: "upcoming", description: "Start your day with mindfulness." },
    ],
    emergencyContacts: [
      { name: "Rajesh Kumar", role: "Society Manager", phone: "+91 98765 43210" },
      { name: "Security Office", role: "24/7 Security", phone: "+91 98765 43211" },
    ],
  },
  {
    id: "sunrise-residency",
    name: "Sunrise Residency",
    address: "456 Sunrise Avenue, Pune",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    amenities: [
      { id: "1", icon: "Dumbbell", name: "Gym", description: "Well-equipped fitness room", category: "Health & Wellness" },
      { id: "2", icon: "Gamepad2", name: "Recreation Room", description: "Indoor games and entertainment", category: "Recreation" },
      { id: "3", icon: "Car", name: "Parking", description: "Open parking facility", category: "Convenience" },
      { id: "4", icon: "Shield", name: "24/7 Security", description: "CCTV and guard service", category: "Security" },
    ],
    events: [
      { id: "1", title: "Annual Sports Day", date: "Jan 15, 2025", time: "7:00 AM - 5:00 PM", location: "Society Grounds", attendees: 85, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop", status: "upcoming", description: "Fun-filled sports for all ages!" },
      { id: "2", title: "Cultural Festival", date: "Feb 14, 2025", time: "4:00 PM - 10:00 PM", location: "Amphitheater", attendees: 200, image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop", status: "upcoming", description: "Celebrate diversity with performances." },
    ],
    emergencyContacts: [
      { name: "Amit Sharma", role: "Society Secretary", phone: "+91 98765 12345" },
      { name: "Fire Safety", role: "Emergency", phone: "101" },
    ],
  },
  {
    id: "palm-grove-society",
    name: "Palm Grove Society",
    address: "789 Palm Beach Road, Bangalore",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop",
    amenities: [
      { id: "1", icon: "Waves", name: "Infinity Pool", description: "Rooftop infinity pool with city views", category: "Recreation" },
      { id: "2", icon: "Coffee", name: "Café & Lounge", description: "In-house café with refreshments", category: "Dining" },
      { id: "3", icon: "Sparkles", name: "Spa & Wellness", description: "Full-service spa treatments", category: "Health & Wellness" },
      { id: "4", icon: "Wifi", name: "High-Speed Internet", description: "Fiber optic connectivity", category: "Technology" },
      { id: "5", icon: "Trees", name: "Rooftop Garden", description: "Organic vegetable garden", category: "Outdoors" },
      { id: "6", icon: "Building", name: "Business Center", description: "Co-working space and meeting rooms", category: "Business" },
    ],
    events: [
      { id: "1", title: "Kids Art Competition", date: "Feb 28, 2025", time: "10:00 AM - 2:00 PM", location: "Recreation Room", attendees: 35, image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", status: "upcoming", description: "Let little artists showcase creativity!" },
      { id: "2", title: "Senior Citizens Day", date: "Mar 8, 2025", time: "11:00 AM - 4:00 PM", location: "Community Hall", attendees: 60, image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop", status: "upcoming", description: "Special day for our respected seniors." },
      { id: "3", title: "Gardening Workshop", date: "Mar 15, 2025", time: "9:00 AM - 12:00 PM", location: "Rooftop Garden", attendees: 25, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop", status: "upcoming", description: "Learn organic gardening techniques." },
    ],
    emergencyContacts: [
      { name: "Priya Nair", role: "Property Manager", phone: "+91 99887 76655" },
      { name: "Medical Emergency", role: "Ambulance", phone: "108" },
      { name: "Security Control", role: "24/7 Security", phone: "+91 99887 76656" },
    ],
  },
];

// Societies Context (for managing the list)
const SocietiesContext = createContext<SocietiesContextType | undefined>(undefined);

interface SocietyContextType {
  selectedSociety: Society | null;
  selectSociety: (society: Society) => void;
  clearSociety: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userRole: "user" | "admin" | null;
  setUserRole: (role: "user" | "admin" | null) => void;
}

const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export function SocietyProvider({ children }: { children: ReactNode }) {
  // Manage the global societies list
  const [societiesList, setSocietiesList] = useState<Society[]>(() => {
    const stored = localStorage.getItem("societiesList");
    return stored ? JSON.parse(stored) : defaultSocieties;
  });

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

  // Persist societies list to localStorage
  useEffect(() => {
    localStorage.setItem("societiesList", JSON.stringify(societiesList));
  }, [societiesList]);

  const addSociety = (society: Society) => {
    setSocietiesList(prev => [...prev, society]);
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
    <SocietiesContext.Provider value={{ societies: societiesList, addSociety }}>
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

// Keep the original export for backward compatibility
export { defaultSocieties as societies };
