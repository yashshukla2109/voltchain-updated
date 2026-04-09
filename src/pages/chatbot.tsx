import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Zap, Mail, Phone, MapPin } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";

// ⚠ WARNING: Directly embedding the API key in client-side code is a SECURITY RISK
const GEMINI_API_KEY = "AIzaSyC-vg0nYAo0ybb5jHLxXJTmDLkCfcKMv24";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// --- Type Definitions ---
interface Message {
  id: number;
  role: "user" | "model";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "model",
    text: "Hello! I'm the VoltChain Chatbot. I can help you with questions about your solar generation, consumption, market data, and more.",
  },
];

// --- Demo Energy & Transaction Data ---
const demoEnergyData = {
  generation: [
    { date: "2025-10-01", kWh: 12.5 },
    { date: "2025-10-02", kWh: 10.2 },
    { date: "2025-10-03", kWh: 14.8 },
    { date: "2025-10-04", kWh: 13.1 },
    { date: "2025-10-05", kWh: 11.7 },
  ],
  consumption: [
    { date: "2025-10-01", kWh: 9.0 },
    { date: "2025-10-02", kWh: 11.0 },
    { date: "2025-10-03", kWh: 12.5 },
    { date: "2025-10-04", kWh: 10.0 },
    { date: "2025-10-05", kWh: 13.2 },
  ],
  transactions: [
    { date: "2025-10-01", type: "sold", amount: 5.0, currency: "kWh" },
    { date: "2025-10-02", type: "purchased", amount: 3.0, currency: "kWh" },
    { date: "2025-10-03", type: "sold", amount: 2.5, currency: "kWh" },
  ],
};

// --- Helper: Generate Energy Summary ---
const getEnergySummary = () => {
  const totalGenerated = demoEnergyData.generation.reduce((sum, e) => sum + e.kWh, 0);
  const totalConsumed = demoEnergyData.consumption.reduce((sum, e) => sum + e.kWh, 0);
  const remainingEnergy = totalGenerated - totalConsumed;

  const transactionsSummary = demoEnergyData.transactions
    .map(t => `${t.date}: ${t.type} ${t.amount} ${t.currency}`)
    .join("\n");

  return `
Energy Summary:
- Total Generated: ${totalGenerated.toFixed(2)} kWh
- Total Consumed: ${totalConsumed.toFixed(2)} kWh
- Remaining Energy: ${remainingEnergy.toFixed(2)} kWh

Recent Transactions:
${transactionsSummary}
  `;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let botResponse: string;

      // If user asks for summary or transactions, return demo data
      if (/summary|account|transactions/i.test(userMessage.text)) {
        botResponse = getEnergySummary();
      } else if (GEMINI_API_KEY) {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Gemini history must start with 'user', so we remove the initial model greeting
        let filteredMessages = messages;
        if (filteredMessages.length > 0 && filteredMessages[0].role === "model") {
          filteredMessages = filteredMessages.slice(1);
        }

        const history = filteredMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
        const chat = geminiModel.startChat({ history });
        const result = await chat.sendMessage(userMessage.text);
        botResponse = result.response.text();
      } else {
        botResponse = "AI service is not available.";
      }

      const modelResponse: Message = { id: Date.now() + 1, role: "model", text: botResponse };
      setMessages((prev) => [...prev, modelResponse]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "model", text: "Oops! Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-lg p-3 rounded-xl shadow-lg ${
          message.role === "user"
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-background rounded-bl-none border border-border"
        }`}
      >
        <div className="mr-3 mt-1">
          {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-accent" />}
        </div>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen gradient-cosmic">
      <div className="mr-64 p-8">
        <div className="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
          <header className="mb-4 animate-fade-in flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Zap className="h-8 w-8 mr-3 text-primary animate-pulse-glow" /> VoltChain Chatbot
              </h1>
              <p className="text-muted-foreground">
                Ask me anything about your energy data or the marketplace.
              </p>
            </div>
            <Button variant="secondary" className="gap-2" onClick={() => setShowContact(!showContact)}>
              <Mail className="h-4 w-4" /> Contact Us
            </Button>
          </header>

          {/* Chat Area */}
          <Card className="flex-grow p-6 bg-card/50 backdrop-blur-sm border-border card-shadow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto mb-4 pr-4 custom-scrollbar">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex max-w-lg p-3 rounded-xl shadow-lg bg-background rounded-bl-none border border-border">
                    <Loader2 className="h-5 w-5 text-accent animate-spin mr-2" /> <p>AI is thinking...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </Card>

          {/* Contact Us Section */}
          {showContact && (
            <Card className="mt-4 p-6 bg-card/50 backdrop-blur-sm border-border card-shadow animate-slide-up">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" /> Contact Us
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" /> support@voltchain.in
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" /> +91 98765 43210
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" /> 123 Solar Street, Bengaluru, Karnataka, India - 560001
                </div>
              </div>
              <p className="mt-3 text-muted-foreground">
                For demo purposes, this is dummy contact info tailored for India.
              </p>
            </Card>
          )}
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Chatbot;
