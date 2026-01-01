import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Building2, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const { toast } = useToast();
  const [societySettings, setSocietySettings] = useState({
    name: "Greenwood Heights",
    address: "123 Green Valley Road, Mumbai",
    email: "admin@greenwoodheights.com",
    phone: "+91 98765 43210",
    description: "A premium residential society with world-class amenities.",
  });

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your society and admin preferences</p>
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
