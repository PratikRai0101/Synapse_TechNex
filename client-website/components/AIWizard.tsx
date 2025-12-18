
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Target, Shield, Landmark, Clock } from 'lucide-react';

const AIWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setLoading(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setLoading(false);
      }, 1500);
    } else {
      onClose();
    }
  };

  const options = [
    { id: 'wealth', label: 'Wealth Creation', desc: 'Long-term capital appreciation for future freedom.', icon: Target },
    { id: 'tax', label: 'Tax Saving', desc: 'Invest in ELSS funds to save up to ₹46,800 yearly.', icon: Shield },
    { id: 'income', label: 'Regular Income', desc: 'Generate steady monthly or quarterly returns.', icon: Landmark },
    { id: 'short', label: 'Short-term Parking', desc: 'Better returns than savings account for idle cash.', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl neumorphic-flat rounded-[40px] border border-white/10 overflow-hidden"
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#3D5AFE] flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded rotate-45" />
              </div>
              <span className="font-bold text-sm tracking-tight">AI Recommendation Wizard</span>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Engine Active</span>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                 <X size={20} />
               </button>
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center">
              <svg className="w-24 h-24 text-[#3D5AFE]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="150" strokeDashoffset="0" className="animate-[spin_2s_linear_infinite]" />
                <path d="M50 20 Q70 50 50 80 Q30 50 50 20" fill="currentColor" opacity="0.5" className="animate-pulse" />
              </svg>
              <h2 className="mt-8 text-xl font-bold">Analyzing market conditions...</h2>
              <p className="text-gray-500 text-sm mt-2">Personalizing your elite wealth strategy</p>
            </div>
          ) : (
            <div className="h-96 flex flex-col">
              <div className="mb-4">
                <span className="text-[10px] text-[#3D5AFE] font-bold uppercase tracking-widest">Step {step} of 3</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">What is your primary goal for this investment?</h2>
              <p className="text-gray-500 text-lg mb-12">Our AI will curate a portfolio based on your financial objectives and risk tolerance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {options.map((opt) => (
                  <button key={opt.id} className="text-left p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all group flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-[#3D5AFE]/10 text-[#3D5AFE] group-hover:bg-[#3D5AFE] group-hover:text-white transition-colors">
                      <opt.icon size={24} />
                    </div>
                    <div>
                      <div className="font-bold mb-1">{opt.label}</div>
                      <div className="text-xs text-gray-500 leading-relaxed">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-12 pt-10 border-t border-white/5">
            <button 
              disabled={step === 1 || loading}
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors disabled:opacity-0"
            >
              <ArrowLeft size={18} />
              <span className="font-bold text-sm">Back</span>
            </button>
            <button 
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-[#3D5AFE] text-white rounded-2xl font-bold hover:bg-[#3D5AFE]/90 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(61,90,254,0.3)]"
            >
              <span className="text-sm">{step === 3 ? 'Generate Strategy' : 'Next Step'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIWizard;
