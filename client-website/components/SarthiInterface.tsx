import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, History, Zap, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import LiquidGlassCard from './LiquidGlassCard';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const SarthiInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "Namaste, Arjun. I am SARTHI. The obsidian layer is synchronized. Your current portfolio XIRR stands at 14.2%. Would you like a deep-dive into rebalancing your HDFC exposure?", 
      timestamp: '10:00 AM' 
    }
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
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: now }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: 'You are SARTHI, the elite AI charioteer for SAMPATTAI. Strictly monochromatic persona. Professional, HNI-focused advisor. Use ₹ for currency.',
        },
      });

      const aiResponse = response.text || "Protocols interrupted. Re-initiating SARTHI-X core...";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Vault shielding is high. Communication lag detected.", timestamp: now }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-[calc(100vh-200px)]">
      <div className="lg:col-span-3 hidden lg:block overflow-y-auto no-scrollbar">
        <LiquidGlassCard className="p-8 h-full space-y-10">
          <div>
            <h3 className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <History size={16} /> History Slats
            </h3>
            <div className="space-y-4">
              {['LTCG Harvest Log', 'Risk Rebalance Oct', 'Equity Volatility Analysis'].map((item, i) => (
                <button key={i} className="w-full text-left p-5 neumorphic-pressed rounded-[24px] text-[11px] text-[var(--text-dim)] font-black uppercase tracking-widest hover:text-[var(--text)] transition-all">
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
             <h3 className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <Zap size={16} /> Rapid Scripts
            </h3>
            <div className="space-y-4">
               {["Yield Curve Overlay", "Expense Friction Audit", "Capital Gain Projections"].map((q, i) => (
                 <button onClick={() => setInputValue(q)} key={i} className="w-full text-left p-5 glass rounded-[24px] text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest hover:bg-[var(--text)]/5 transition-all">
                   {q}
                 </button>
               ))}
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      <div className="lg:col-span-9 flex flex-col neumorphic-flat rounded-[48px] border border-[var(--border)] overflow-hidden">
        <div className="px-10 py-8 border-b border-[var(--border)] flex items-center justify-between backdrop-blur-3xl bg-[var(--bg)]/40">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full glass border border-[var(--border)] p-1 relative">
               <div className="w-full h-full rounded-full bg-[var(--text)] opacity-80" />
               <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[var(--text)] border-4 border-[var(--bg)] rounded-full" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-[var(--text)]">SARTHI CORE</h2>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--text)] animate-pulse" />
                 <span className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Active Intelligence Layer</span>
              </div>
            </div>
          </div>
          <button className="p-4 glass rounded-full border border-[var(--border)] hover:border-[var(--text)]/40 transition-all">
            <Info size={24} className="text-[var(--text-dim)]" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar scroll-smooth">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col gap-3 max-w-[80%]`}>
                <div className={`relative p-8 rounded-[40px] ${msg.role === 'user' ? 'neumorphic-pressed rounded-br-none' : 'glass bg-[var(--text)]/[0.04] border border-[var(--border)] rounded-bl-none shadow-2xl'}`}>
                  {msg.role === 'ai' && <div className="absolute top-3 left-6 w-2 h-2 bg-[var(--text)] rounded-full blur-[1px] opacity-40" />}
                  <p className={`text-base leading-relaxed ${msg.role === 'user' ? 'text-[var(--text-muted)]' : 'text-[var(--text)] font-black uppercase tracking-tight'}`}>
                    {msg.content}
                  </p>
                </div>
                <span className={`text-[9px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-10 bg-[var(--bg)]/60 border-t border-[var(--border)]">
           <div className="relative neumorphic-pressed rounded-full flex items-center p-2 focus-within:ring-4 focus-within:ring-[var(--text)]/5 transition-all">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Submit Strategy Command..."
                className="flex-1 bg-transparent py-6 px-10 outline-none text-lg text-[var(--text)] font-black uppercase tracking-widest placeholder:text-[var(--text-dim)]"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${inputValue.trim() ? 'bg-[var(--text)] text-[var(--bg)] shadow-[0_0_40px_rgba(128,128,128,0.3)]' : 'bg-[var(--text)]/5 text-[var(--text-dim)]'}`}
              >
                <Send size={28} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SarthiInterface;