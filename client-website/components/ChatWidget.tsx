import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare } from 'lucide-react';
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Temporarily using mock response - install @google/generative-ai to enable real Gemini API
// const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
// const model = genAI.getGenerativeModel({ 
//   model: "gemini-1.5-flash",
//   systemInstruction: "You are SAMPATTAI Monolith, an elite AI wealth advisor. persona: cold, professional. Focus on monochromatic wealth management. All amounts in ₹."
// });

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'The Vault is open. Shall we optimize for maximum Alpha?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Mock response until Gemini API is configured
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResponse = "The Vault acknowledges your inquiry. To unlock AI-powered wealth optimization, configure the Gemini API key in ChatWidget.tsx";
      setMessages(prev => [...prev, { role: 'ai', content: mockResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Vault protocols blocked. Verify API Key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        className="w-20 h-20 rounded-full neumorphic-flat p-1 border border-white/10 relative overflow-hidden bg-black"
      >
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <MessageSquare size={28} className="text-white opacity-40" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-24 right-0 w-[420px] h-[640px] flex flex-col rounded-[48px] overflow-hidden glass border border-white/20 shadow-2xl bg-black"
          >
            <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
              <div className="text-xs font-black uppercase text-white">SAMPATTAI Monolith</div>
              <button onClick={() => setIsOpen(false)} className="text-gray-600"><X size={24} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-[32px] border ${msg.role === 'user' ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/20 text-white font-bold'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-transparent py-4 px-6 outline-none text-white text-sm uppercase font-black"
                  placeholder="Initiate Command..."
                />
                <button onClick={handleSendMessage} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center">
                  <Send size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;