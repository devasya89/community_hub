import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface MaintenanceCategory {
  name: string;
  amount: number;
}

export interface MaintenanceRecord {
  id: string;
  societyId: string;
  unitNumber: string;
  residentName: string;
  month: string; // e.g. "January 2026"
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  categories: MaintenanceCategory[];
  penalty: number;
  paymentDate?: string;
  receiptNumber?: string;
  paymentMethod?: string;
}

const generateReceipt = () => `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const defaultRecords: MaintenanceRecord[] = [
  // Greenwood Heights
  { id: "gh-1", societyId: "greenwood-heights", unitNumber: "A-101", residentName: "Rahul Mehta", month: "January 2026", amount: 5500, dueDate: "Jan 10, 2026", status: "paid", categories: [{ name: "Water", amount: 800 }, { name: "Security", amount: 1200 }, { name: "Cleaning", amount: 1000 }, { name: "Elevator", amount: 700 }, { name: "Garden", amount: 500 }, { name: "Common Electricity", amount: 800 }, { name: "Sinking Fund", amount: 500 }], penalty: 0, paymentDate: "Jan 5, 2026", receiptNumber: "RCP-GH-001", paymentMethod: "UPI" },
  { id: "gh-2", societyId: "greenwood-heights", unitNumber: "A-102", residentName: "Priya Sharma", month: "January 2026", amount: 5500, dueDate: "Jan 10, 2026", status: "pending", categories: [{ name: "Water", amount: 800 }, { name: "Security", amount: 1200 }, { name: "Cleaning", amount: 1000 }, { name: "Elevator", amount: 700 }, { name: "Garden", amount: 500 }, { name: "Common Electricity", amount: 800 }, { name: "Sinking Fund", amount: 500 }], penalty: 0 },
  { id: "gh-3", societyId: "greenwood-heights", unitNumber: "B-201", residentName: "Amit Patel", month: "January 2026", amount: 5500, dueDate: "Jan 10, 2026", status: "overdue", categories: [{ name: "Water", amount: 800 }, { name: "Security", amount: 1200 }, { name: "Cleaning", amount: 1000 }, { name: "Elevator", amount: 700 }, { name: "Garden", amount: 500 }, { name: "Common Electricity", amount: 800 }, { name: "Sinking Fund", amount: 500 }], penalty: 500 },
  { id: "gh-4", societyId: "greenwood-heights", unitNumber: "A-101", residentName: "Rahul Mehta", month: "February 2026", amount: 5500, dueDate: "Feb 10, 2026", status: "pending", categories: [{ name: "Water", amount: 800 }, { name: "Security", amount: 1200 }, { name: "Cleaning", amount: 1000 }, { name: "Elevator", amount: 700 }, { name: "Garden", amount: 500 }, { name: "Common Electricity", amount: 800 }, { name: "Sinking Fund", amount: 500 }], penalty: 0 },
  { id: "gh-5", societyId: "greenwood-heights", unitNumber: "C-303", residentName: "Sneha Gupta", month: "January 2026", amount: 5500, dueDate: "Jan 10, 2026", status: "paid", categories: [{ name: "Water", amount: 800 }, { name: "Security", amount: 1200 }, { name: "Cleaning", amount: 1000 }, { name: "Elevator", amount: 700 }, { name: "Garden", amount: 500 }, { name: "Common Electricity", amount: 800 }, { name: "Sinking Fund", amount: 500 }], penalty: 0, paymentDate: "Jan 8, 2026", receiptNumber: "RCP-GH-005", paymentMethod: "Bank Transfer" },

  // Sunrise Residency
  { id: "sr-1", societyId: "sunrise-residency", unitNumber: "101", residentName: "Vikram Singh", month: "January 2026", amount: 4000, dueDate: "Jan 10, 2026", status: "paid", categories: [{ name: "Water", amount: 600 }, { name: "Security", amount: 1000 }, { name: "Cleaning", amount: 800 }, { name: "Parking", amount: 500 }, { name: "Common Electricity", amount: 600 }, { name: "Sinking Fund", amount: 500 }], penalty: 0, paymentDate: "Jan 3, 2026", receiptNumber: "RCP-SR-001", paymentMethod: "Cash" },
  { id: "sr-2", societyId: "sunrise-residency", unitNumber: "205", residentName: "Neha Joshi", month: "January 2026", amount: 4000, dueDate: "Jan 10, 2026", status: "overdue", categories: [{ name: "Water", amount: 600 }, { name: "Security", amount: 1000 }, { name: "Cleaning", amount: 800 }, { name: "Parking", amount: 500 }, { name: "Common Electricity", amount: 600 }, { name: "Sinking Fund", amount: 500 }], penalty: 300 },
  { id: "sr-3", societyId: "sunrise-residency", unitNumber: "302", residentName: "Karan Desai", month: "January 2026", amount: 4000, dueDate: "Jan 10, 2026", status: "pending", categories: [{ name: "Water", amount: 600 }, { name: "Security", amount: 1000 }, { name: "Cleaning", amount: 800 }, { name: "Parking", amount: 500 }, { name: "Common Electricity", amount: 600 }, { name: "Sinking Fund", amount: 500 }], penalty: 0 },

  // Palm Grove Society
  { id: "pg-1", societyId: "palm-grove-society", unitNumber: "PG-101", residentName: "Arjun Nair", month: "January 2026", amount: 8000, dueDate: "Jan 10, 2026", status: "paid", categories: [{ name: "Water", amount: 1000 }, { name: "Security", amount: 1500 }, { name: "Cleaning", amount: 1200 }, { name: "Pool Maintenance", amount: 800 }, { name: "Garden", amount: 600 }, { name: "Common Electricity", amount: 1200 }, { name: "Spa & Wellness", amount: 700 }, { name: "Sinking Fund", amount: 1000 }], penalty: 0, paymentDate: "Jan 2, 2026", receiptNumber: "RCP-PG-001", paymentMethod: "UPI" },
  { id: "pg-2", societyId: "palm-grove-society", unitNumber: "PG-205", residentName: "Meera Iyer", month: "January 2026", amount: 8000, dueDate: "Jan 10, 2026", status: "pending", categories: [{ name: "Water", amount: 1000 }, { name: "Security", amount: 1500 }, { name: "Cleaning", amount: 1200 }, { name: "Pool Maintenance", amount: 800 }, { name: "Garden", amount: 600 }, { name: "Common Electricity", amount: 1200 }, { name: "Spa & Wellness", amount: 700 }, { name: "Sinking Fund", amount: 1000 }], penalty: 0 },
  { id: "pg-3", societyId: "palm-grove-society", unitNumber: "PG-310", residentName: "Rohan Kapoor", month: "January 2026", amount: 8000, dueDate: "Jan 10, 2026", status: "overdue", categories: [{ name: "Water", amount: 1000 }, { name: "Security", amount: 1500 }, { name: "Cleaning", amount: 1200 }, { name: "Pool Maintenance", amount: 800 }, { name: "Garden", amount: 600 }, { name: "Common Electricity", amount: 1200 }, { name: "Spa & Wellness", amount: 700 }, { name: "Sinking Fund", amount: 1000 }], penalty: 800 },
  { id: "pg-4", societyId: "palm-grove-society", unitNumber: "PG-101", residentName: "Arjun Nair", month: "February 2026", amount: 8000, dueDate: "Feb 10, 2026", status: "pending", categories: [{ name: "Water", amount: 1000 }, { name: "Security", amount: 1500 }, { name: "Cleaning", amount: 1200 }, { name: "Pool Maintenance", amount: 800 }, { name: "Garden", amount: 600 }, { name: "Common Electricity", amount: 1200 }, { name: "Spa & Wellness", amount: 700 }, { name: "Sinking Fund", amount: 1000 }], penalty: 0 },
];

interface MaintenanceContextType {
  records: MaintenanceRecord[];
  payMaintenance: (recordId: string, method: string) => void;
  getRecordsBySociety: (societyId: string) => MaintenanceRecord[];
  getAllRecords: () => MaintenanceRecord[];
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    const stored = localStorage.getItem("maintenanceRecords");
    return stored ? JSON.parse(stored) : defaultRecords;
  });

  useEffect(() => {
    localStorage.setItem("maintenanceRecords", JSON.stringify(records));
  }, [records]);

  const payMaintenance = (recordId: string, method: string) => {
    setRecords(prev =>
      prev.map(r =>
        r.id === recordId
          ? {
              ...r,
              status: "paid" as const,
              paymentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              receiptNumber: generateReceipt(),
              paymentMethod: method,
            }
          : r
      )
    );
  };

  const getRecordsBySociety = (societyId: string) =>
    records.filter(r => r.societyId === societyId);

  const getAllRecords = () => records;

  return (
    <MaintenanceContext.Provider value={{ records, payMaintenance, getRecordsBySociety, getAllRecords }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) throw new Error("useMaintenance must be used within MaintenanceProvider");
  return context;
}
