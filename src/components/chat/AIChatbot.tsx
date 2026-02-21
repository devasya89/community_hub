import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FAQ_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["maintenance", "pay", "bill", "dues", "payment"],
    response: "You can view and pay your maintenance dues from the **Maintenance** section in the navigation menu. It shows a breakdown of all charges including water, security, cleaning, and more. You can pay via UPI, Credit/Debit Card, or Net Banking.",
  },
  {
    keywords: ["complaint", "issue", "problem", "report"],
    response: "To raise a complaint, go to the **Complaints** section from the navigation menu. Click on 'New Complaint', fill in the details, and submit. You'll be able to track the status of your complaint in real-time.",
  },
  {
    keywords: ["visitor", "guest", "entry", "gate"],
    response: "You can pre-approve visitors from the **Visitors** section. Add your guest's name, purpose, and expected time. The security gate will be notified automatically for a smooth entry.",
  },
  {
    keywords: ["event", "function", "celebration", "activity"],
    response: "Check out upcoming society events in the **Events** section. You can view event details, timings, venue, and RSVP to attend. Stay updated on all community activities!",
  },
  {
    keywords: ["amenity", "amenities", "gym", "pool", "parking", "garden"],
    response: "Our society offers various amenities! Visit the **Amenities** section to explore facilities like the gym, swimming pool, parking, gardens, and community hall. Each listing has details about timings and availability.",
  },
  {
    keywords: ["contact", "emergency", "help", "manager", "security"],
    response: "For emergencies, visit the **Contact** section to find emergency contacts including the Society Manager, Security Office, and local emergency services. For urgent matters, call security directly.",
  },
  {
    keywords: ["parking", "car", "vehicle", "slot"],
    response: "Parking information is available in the **Amenities** section. If you have a parking-related complaint, please raise it through the **Complaints** section with details of the issue.",
  },
  {
    keywords: ["noise", "loud", "disturbance"],
    response: "For noise complaints, please go to **Complaints** and file a report with the flat number and time of disturbance. The society management will address it promptly. For immediate help, contact security.",
  },
  {
    keywords: ["water", "leak", "plumbing", "supply"],
    response: "For water-related issues (leaks, low pressure, supply disruption), please file a complaint in the **Complaints** section. For emergency leaks, contact the Society Manager immediately from the **Contact** section.",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good evening"],
    response: "Hello! 👋 I'm your SocietyHub assistant. I can help you with maintenance payments, complaints, visitor management, events, amenities, and more. How can I assist you today?",
  },
  {
    keywords: ["thank", "thanks", "bye", "okay"],
    response: "You're welcome! If you need any more help, feel free to ask anytime. Have a great day! 😊",
  },
];

const DEFAULT_RESPONSE =
  "I'm not sure about that specific topic yet, but I can help with **maintenance payments**, **complaints**, **visitor management**, **events**, **amenities**, and **emergency contacts**. Could you rephrase your question or ask about one of these topics?";

function getResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const faq of FAQ_RESPONSES) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.response;
    }
  }
  return DEFAULT_RESPONSE;
}

function renderMarkdownBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! 👋 I'm your SocietyHub assistant. Ask me anything about maintenance, complaints, visitors, events, or amenities!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getResponse(trimmed);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full gold-gradient shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 md:bottom-6 right-4 z-50 w-[340px] sm:w-[380px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border gold-gradient">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="font-semibold text-sm text-primary-foreground">SocietyHub Assistant</p>
                  <p className="text-xs text-primary-foreground/70">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-secondary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? renderMarkdownBold(msg.content) : msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-muted/50 border-border text-sm"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="gold-gradient text-primary-foreground hover:opacity-90 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
