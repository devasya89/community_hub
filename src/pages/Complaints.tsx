import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { MessageSquare, Send, ThumbsUp, AlertCircle } from "lucide-react";
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
import { Navigate } from "react-router-dom";

const complaintCategories = [
  "Maintenance",
  "Security",
  "Parking",
  "Noise",
  "Cleanliness",
  "Facilities",
  "Other",
];

const existingComplaints = [
  {
    id: 1,
    subject: "Water leakage in bathroom",
    category: "Maintenance",
    status: "In Progress",
    date: "Dec 27, 2024",
    description: "There's a water leak from the ceiling in the master bathroom.",
  },
  {
    id: 2,
    subject: "Parking spot occupied",
    category: "Parking",
    status: "Resolved",
    date: "Dec 25, 2024",
    description: "Someone is regularly parking in my designated spot A-15.",
  },
  {
    id: 3,
    subject: "Elevator not working",
    category: "Maintenance",
    status: "Pending",
    date: "Dec 28, 2024",
    description: "The elevator in Tower B has been out of service since morning.",
  },
];

const Complaints = () => {
  const { selectedSociety, isLoggedIn } = useSociety();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    flatNo: "",
    email: "",
    category: "",
    subject: "",
    description: "",
  });
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    rating: "",
    feedback: "",
  });

  if (!selectedSociety || !isLoggedIn) {
    return <Navigate to="/select-society" replace />;
  }

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been registered successfully. We'll get back to you soon.",
    });
    setFormData({
      name: "",
      flatNo: "",
      email: "",
      category: "",
      subject: "",
      description: "",
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully.",
    });
    setFeedbackData({
      name: "",
      rating: "",
      feedback: "",
    });
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
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="flatNo">Flat Number</Label>
                        <Input
                          id="flatNo"
                          placeholder="e.g., A-101"
                          value={formData.flatNo}
                          onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
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

                    <Button type="submit" variant="gold" size="lg" className="w-full gap-2">
                      <Send className="w-4 h-4" />
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
                  {existingComplaints.map((complaint) => (
                    <div key={complaint.id} className="glass-card p-6 rounded-2xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                              {complaint.subject}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                complaint.status === "Resolved"
                                  ? "bg-success/20 text-success"
                                  : complaint.status === "In Progress"
                                  ? "bg-warning/20 text-warning"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {complaint.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Category: {complaint.category}</span>
                            <span>•</span>
                            <span>{complaint.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
