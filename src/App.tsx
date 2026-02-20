import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocietyProvider } from "@/contexts/SocietyContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";
import Index from "./pages/Index";
import SelectSociety from "./pages/SelectSociety";
import Dashboard from "./pages/Dashboard";
import Amenities from "./pages/Amenities";
import Events from "./pages/Events";
import Visitors from "./pages/Visitors";
import Complaints from "./pages/Complaints";
import Contact from "./pages/Contact";
import ContactPublic from "./pages/ContactPublic";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVisitors from "./pages/admin/AdminVisitors";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminAmenities from "./pages/admin/AdminAmenities";
import AdminEmergency from "./pages/admin/AdminEmergency";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SocietyProvider>
        <AdminProvider>
          <MaintenanceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/select-society" element={<SelectSociety />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/events" element={<Events />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact-us" element={<ContactPublic />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/visitors" element={<AdminVisitors />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/amenities" element={<AdminAmenities />} />
              <Route path="/admin/emergency" element={<AdminEmergency />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/maintenance" element={<AdminMaintenance />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </MaintenanceProvider>
        </AdminProvider>
      </SocietyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
