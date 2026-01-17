import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Star, MessageSquare, LayoutDashboard, Settings, Phone, UserCog } from "lucide-react";
import { useSociety } from "@/contexts/SocietyContext";

const userNavItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/visitors", icon: Users, label: "Visitors" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/amenities", icon: Star, label: "Amenities" },
  { href: "/complaints", icon: MessageSquare, label: "Complaints" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { isLoggedIn, selectedSociety } = useSociety();

  // Don't show on public pages or admin pages
  if (!isLoggedIn || !selectedSociety || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16">
        {userNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Admin bottom navigation
const adminNavItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminMobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
