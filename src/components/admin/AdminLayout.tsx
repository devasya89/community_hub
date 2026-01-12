import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Star,
  Phone,
  Building2,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  UserCog,
  ChevronDown,
  Check,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSociety, societies } from "@/contexts/SocietyContext";
import { useAdmin } from "@/contexts/AdminContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/visitors", icon: UserCog, label: "Visitors" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/complaints", icon: MessageSquare, label: "Complaints" },
  { href: "/admin/amenities", icon: Star, label: "Amenities" },
  { href: "/admin/emergency", icon: Phone, label: "Emergency" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const notifications = [
  {
    id: 1,
    title: "New Complaint",
    message: "A new complaint has been submitted by Unit A-101",
    time: "5 min ago",
    unread: true
  },
  {
    id: 2,
    title: "Visitor Arrived",
    message: "Delivery person at gate for Unit B-205",
    time: "15 min ago",
    unread: true
  },
  {
    id: 3,
    title: "Event Reminder",
    message: "Annual General Meeting tomorrow at 6 PM",
    time: "1 hour ago",
    unread: false
  },
  {
    id: 4,
    title: "Maintenance Update",
    message: "Elevator maintenance completed successfully",
    time: "2 hours ago",
    unread: false
  },
  {
    id: 5,
    title: "New Registration",
    message: "New user registration request from Unit C-302",
    time: "3 hours ago",
    unread: false
  }
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { clearSociety } = useSociety();
  const { 
    adminType, 
    selectedAdminSociety, 
    setSelectedAdminSociety, 
    getAccessibleSocieties,
    logout 
  } = useAdmin();

  const unreadCount = notifications.filter(n => n.unread).length;
  const accessibleSocieties = getAccessibleSocieties();

  const handleLogout = () => {
    logout();
    clearSociety();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="font-display text-lg font-semibold text-sidebar-foreground">
                  Society<span className="text-sidebar-primary">Hub</span>
                </span>
                <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Society Selector */}
          <div className="px-4 py-3 border-b border-sidebar-border bg-sidebar-accent/30">
            <p className="text-xs text-sidebar-foreground/60 mb-2 flex items-center gap-1">
              {adminType === "super" && <Crown className="w-3 h-3 text-sidebar-primary" />}
              {adminType === "super" ? "Super Admin - Select Society" : "Assigned Society"}
            </p>
            {adminType === "super" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between h-auto py-2 px-3 bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-foreground"
                  >
                    <span className="text-sm font-medium truncate">
                      {selectedAdminSociety?.name || "Select Society"}
                    </span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {accessibleSocieties.map((society) => (
                    <DropdownMenuItem
                      key={society.id}
                      onClick={() => setSelectedAdminSociety(society)}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{society.name}</p>
                        <p className="text-xs text-muted-foreground">{society.address}</p>
                      </div>
                      {selectedAdminSociety?.id === society.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="bg-sidebar-accent/50 rounded-lg py-2 px-3">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {selectedAdminSociety?.name || "No Society Assigned"}
                </p>
                <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                  Access restricted to this society only
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} new
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    {notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className="flex flex-col items-start p-3 cursor-pointer focus:bg-muted"
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <span className={`font-medium text-sm ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </span>
                          {notification.unread && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground/70 mt-1">
                          {notification.time}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary text-sm">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {adminType === "super" ? "S" : "A"}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-foreground">Admin User</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {adminType === "super" && <Crown className="w-3 h-3" />}
                        {adminType === "super" ? "Super Admin" : "Admin"}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
