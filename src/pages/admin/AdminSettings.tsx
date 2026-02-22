import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Building2, Bell, Shield, Save, ChevronDown, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Society, useSocieties } from "@/contexts/SocietyContext";
import { useAdmin } from "@/contexts/AdminContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminSettings = () => {
  const { toast } = useToast();
  const { adminType, selectedAdminSociety, setSelectedAdminSociety, assignedSociety } = useAdmin();
  const { societies } = useSocieties();
  
  // Get accessible societies based on admin type
  const accessibleSocieties = adminType === "super" 
    ? societies 
    : (assignedSociety ? [assignedSociety] : []);
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(selectedAdminSociety);
  
  // Keep selectedSociety in sync with selectedAdminSociety
  useEffect(() => {
    if (selectedAdminSociety) {
      setSelectedSociety(selectedAdminSociety);
    }
  }, [selectedAdminSociety]);
  
  const [societySettings, setSocietySettings] = useState({
    name: selectedSociety?.name || "",
    address: selectedSociety?.address || "",
    email: selectedSociety ? `admin@${selectedSociety.slug?.replace(/-/g, "") || selectedSociety.id.replace(/-/g, "")}.com` : "",
    phone: "+91 98765 43210",
    description: "A premium residential society with world-class amenities.",
  });

  // Update settings when society changes
  useEffect(() => {
    if (selectedSociety) {
      setSocietySettings({
        name: selectedSociety.name,
        address: selectedSociety.address,
        email: `admin@${selectedSociety.slug?.replace(/-/g, "") || selectedSociety.id.replace(/-/g, "")}.com`,
        phone: "+91 98765 43210",
        description: "A premium residential society with world-class amenities.",
      });
    }
  }, [selectedSociety]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    complaintAlerts: true,
    visitorAlerts: true,
    eventReminders: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAttempts: "5",
  });

  const handleSaveGeneral = () => {
    toast({ title: "Settings Saved", description: "Society settings have been updated." });
  };

  const handleSaveNotifications = () => {
    toast({ title: "Settings Saved", description: "Notification preferences have been updated." });
  };

  const handleSaveSecurity = () => {
    toast({ title: "Settings Saved", description: "Security settings have been updated." });
  };

  // Handle society change for super admin
  const handleSocietyChange = (society: Society) => {
    setSelectedSociety(society);
    if (adminType === "super") {
      setSelectedAdminSociety(society);
    }
  };

  if (!selectedSociety) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Society Selected</h2>
          <p className="text-muted-foreground">Please select a society from the sidebar to manage settings.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your society and admin preferences</p>
          </div>
          
          {/* Society Selector - Only show dropdown for super admin */}
          {adminType === "super" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-secondary" />
                    <span className="truncate">{selectedSociety.name}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[250px]">
                {accessibleSocieties.map((society) => (
                  <DropdownMenuItem
                    key={society.id}
                    onClick={() => handleSocietyChange(society)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{society.name}</span>
                    {selectedSociety.id === society.id && (
                      <Check className="w-4 h-4 text-secondary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Normal admin - show fixed society info
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-secondary" />
                <span className="font-medium text-foreground">{selectedSociety.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">(Your assigned society)</span>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="general" className="gap-2">
                <Building2 className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="glass-card p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-xl gold-gradient flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">Society Information</h2>
                    <p className="text-muted-foreground text-sm">Update your society's basic information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Society Name</Label>
                    <Input
                      value={societySettings.name}
                      onChange={(e) => setSocietySettings({ ...societySettings, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={societySettings.email}
                      onChange={(e) => setSocietySettings({ ...societySettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={societySettings.phone}
                      onChange={(e) => setSocietySettings({ ...societySettings, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={societySettings.address}
                      onChange={(e) => setSocietySettings({ ...societySettings, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={4}
                    value={societySettings.description}
                    onChange={(e) => setSocietySettings({ ...societySettings, description: e.target.value })}
                  />
                </div>

                <Button variant="gold" className="gap-2" onClick={handleSaveGeneral}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="glass-card p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">Notification Preferences</h2>
                    <p className="text-muted-foreground text-sm">Configure how you receive notifications</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Channels</h3>
                    <div className="space-y-4">
                      {[
                        { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                        { key: "smsNotifications", label: "SMS Notifications", desc: "Get text message alerts" },
                        { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, [item.key]: checked })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Alert Types</h3>
                    <div className="space-y-4">
                      {[
                        { key: "complaintAlerts", label: "New Complaint Alerts", desc: "Get notified for new complaints" },
                        { key: "visitorAlerts", label: "Visitor Alerts", desc: "Notifications for visitor check-ins" },
                        { key: "eventReminders", label: "Event Reminders", desc: "Upcoming event reminders" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch
                            checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({ ...notificationSettings, [item.key]: checked })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="gold" className="gap-2" onClick={handleSaveNotifications}>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="glass-card p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">Security Settings</h2>
                    <p className="text-muted-foreground text-sm">Configure security and access controls</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Max Login Attempts</Label>
                      <Input
                        type="number"
                        value={securitySettings.loginAttempts}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Lock account after failed attempts</p>
                    </div>
                  </div>
                </div>

                <Button variant="gold" className="gap-2" onClick={handleSaveSecurity}>
                  <Save className="w-4 h-4" />
                  Save Security Settings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
