import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSociety } from "@/contexts/SocietyContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

const Contact = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    if (!selectedSociety) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("society_id", selectedSociety.id);
      setEmergencyContacts(data || []);
    };
    fetch();
  }, [selectedSociety]);

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent", description: "We've received your message and will respond shortly." });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout showChatbot>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">{selectedSociety.name}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">Contact <span className="gradient-text">Us</span></h1>
            <p className="text-muted-foreground text-lg">Have questions? Reach out to us or access emergency contacts when you need help.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full gap-2"><Send className="w-4 h-4" />Send Message</Button>
                </form>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="glass-card p-8 rounded-2xl mb-8">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Society Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                    <div><h3 className="font-medium text-foreground">Address</h3><p className="text-muted-foreground text-sm">{selectedSociety.address}</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                    <div><h3 className="font-medium text-foreground">Email</h3><p className="text-muted-foreground text-sm">contact@{selectedSociety.slug}.societyhub.com</p></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-primary" /></div>
                    <div><h3 className="font-medium text-foreground">Office Hours</h3><p className="text-muted-foreground text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p></div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl border-2 border-destructive/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center"><Phone className="w-5 h-5 text-destructive" /></div>
                  <h2 className="font-display text-2xl font-semibold text-foreground">Emergency Contacts</h2>
                </div>
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div><h3 className="font-medium text-foreground">{contact.name}</h3><p className="text-xs text-muted-foreground">{contact.role}</p></div>
                      <a href={`tel:${contact.phone}`} className="font-mono text-lg font-semibold text-destructive hover:underline">{contact.phone}</a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
