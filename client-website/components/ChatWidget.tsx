
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'The Vault is open, Arjun. Shall we optimize for maximum Alpha?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: 'You are SAMPATTAI Monolith, an elite AI wealth advisor. Your persona is cold, professional, and precise. Use technical financial language. Focus exclusively on monochromatic wealth management. All amounts in ₹.',
        },
      });

      const aiResponse = response.text || "Connection to the Monolith is unstable. Re-authenticating...";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Vault protocols blocked the request. Try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      {/* Liquid Glass Orb (Smoke Effect) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-20 h-20 rounded-full neumorphic-flat p-1 border border-white/10 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black" />
        {/* Swirling Smoke Effect */}
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className="smoke-particle absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 rounded-full blur-xl"
            style={{ animationDelay: `${i * 2}s` }}
          />
        ))}
        
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <MessageSquare size={28} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/40 blur-md rounded-full" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="absolute bottom-24 right-0 w-[420px] h-[640px] flex flex-col rounded-[48px] overflow-hidden glass border border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
          >
            <div className="px-8 py-6 bg-black/60 flex items-center justify-between border-b border-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full glass border border-white/30 flex items-center justify-center">
                   <div className="w-5 h-5 rounded-full bg-white pulse-liquid" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-white">SAMPATTAI Monolith</div>
                  <div className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mt-0.5">Quantum Wealth Layer</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-white transition-all"><X size={24} /></button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar bg-black/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[85%] neumorphic-pressed p-6 rounded-[32px] rounded-br-none border border-white/5">
                      <p className="text-sm text-gray-300 leading-relaxed font-medium">{msg.content}</p>
                    </div>
                  ) : (
                    <div className="max-w-[85%] glass bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[32px] rounded-bl-none shadow-2xl relative group">
                      <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-white/50 rounded-full blur-[0.5px]" />
                      <p className="text-sm text-white leading-relaxed font-bold">{msg.content}</p>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass px-6 py-4 rounded-[32px] border border-white/10 flex gap-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />)}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-black/60 border-t border-white/5">
              <div className="neumorphic-pressed rounded-full flex items-center p-2 focus-within:ring-2 focus-within:ring-white/10 transition-all">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Initiate Command..."
                  className="flex-1 bg-transparent py-4 px-6 outline-none text-sm text-white placeholder:text-gray-800 font-black uppercase tracking-widest"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    inputValue.trim() ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-gray-800'
                  }`}
                >
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
