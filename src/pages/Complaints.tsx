import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { MessageSquare, Send, ThumbsUp, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSociety } from "@/contexts/SocietyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const complaintCategories = [
  "Maintenance",
  "Security",
  "Parking",
  "Noise",
  "Cleanliness",
  "Facilities",
  "Other",
];

const statusMap: Record<string, string> = {
  open: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const Complaints = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "medium",
  });
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    rating: "",
    feedback: "",
  });

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints', user?.id, selectedSociety.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user!.id)
        .eq('society_id', selectedSociety.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!selectedSociety,
  });

  const createComplaint = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('complaints').insert({
        user_id: user!.id,
        society_id: selectedSociety.id,
        title: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority as any,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been registered successfully.",
      });
      setFormData({ category: "", subject: "", description: "", priority: "medium" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description || !formData.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    createComplaint.mutate();
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully.",
    });
    setFeedbackData({ name: "", rating: "", feedback: "" });
  };

  return (
    <Layout showChatbot>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-secondary font-medium text-sm uppercase tracking-wider">
              {selectedSociety.name}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
              Complaints & <span className="gradient-text">Feedback</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Submit your complaints or share your feedback to help us improve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Tabs defaultValue="complaint" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="complaint" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  File Complaint
                </TabsTrigger>
                <TabsTrigger value="feedback" className="gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Give Feedback
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  My Complaints
                </TabsTrigger>
              </TabsList>

              <TabsContent value="complaint">
                <div className="glass-card p-8 rounded-2xl">
                  <form onSubmit={handleComplaintSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {complaintCategories.map((cat) => (
                              <SelectItem key={cat} value={cat.toLowerCase()}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => setFormData({ ...formData, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief subject of your complaint"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your complaint in detail..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" variant="gold" size="lg" className="w-full gap-2" disabled={createComplaint.isPending}>
                      {createComplaint.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Complaint
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="feedback">
                <div className="glass-card p-8 rounded-2xl">
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="feedbackName">Your Name (Optional)</Label>
                      <Input
                        id="feedbackName"
                        placeholder="Enter your name"
                        value={feedbackData.name}
                        onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Overall Rating</Label>
                      <Select
                        value={feedbackData.rating}
                        onValueChange={(value) => setFeedbackData({ ...feedbackData, rating: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="How would you rate our services?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                          <SelectItem value="good">⭐⭐⭐⭐ Good</SelectItem>
                          <SelectItem value="average">⭐⭐⭐ Average</SelectItem>
                          <SelectItem value="poor">⭐⭐ Poor</SelectItem>
                          <SelectItem value="very-poor">⭐ Very Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feedbackText">Your Feedback</Label>
                      <Textarea
                        id="feedbackText"
                        placeholder="Share your thoughts, suggestions, or appreciation..."
                        rows={5}
                        value={feedbackData.feedback}
                        onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                      <ThumbsUp className="w-4 h-4" />
                      Submit Feedback
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="glass-card p-8 rounded-2xl text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="glass-card p-8 rounded-2xl text-center text-muted-foreground">
                      No complaints found. File one to get started.
                    </div>
                  ) : (
                    complaints.map((complaint) => (
                      <div key={complaint.id} className="glass-card p-6 rounded-2xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-display text-lg font-semibold text-foreground">
                                {complaint.title}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  complaint.status === "resolved"
                                    ? "bg-success/20 text-success"
                                    : complaint.status === "in_progress"
                                    ? "bg-warning/20 text-warning"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {statusMap[complaint.status] || complaint.status}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                              {complaint.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Category: {complaint.category}</span>
                              <span>•</span>
                              <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                            </div>
                            {complaint.admin_response && (
                              <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                <p className="text-xs font-semibold text-primary mb-1">Admin Response:</p>
                                <p className="text-sm text-muted-foreground">{complaint.admin_response}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Complaints;
