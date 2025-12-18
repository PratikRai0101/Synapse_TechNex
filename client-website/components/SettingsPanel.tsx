
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, CreditCard, Bell, Zap, LogOut, ChevronRight } from 'lucide-react';

const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className="w-14 h-8 neumorphic-pressed rounded-full p-1 transition-all duration-500"
  >
    <motion.div 
      animate={{ x: active ? 24 : 0 }}
      className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${active ? 'bg-white' : 'bg-gray-800'}`}
    >
      {active && <div className="w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" />}
    </motion.div>
  </button>
);

const SettingRow = ({ icon: Icon, label, sublabel, action }: any) => (
  <motion.div 
    whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
    className="flex items-center justify-between p-6 rounded-[24px] cursor-pointer group transition-all border border-transparent hover:border-white/5"
  >
    <div className="flex items-center gap-5">
      <div className="p-3 glass rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
        <Icon size={20} className="text-gray-500 group-hover:text-white" />
      </div>
      <div>
        <div className="text-sm font-bold text-gray-200 group-hover:text-white">{label}</div>
        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{sublabel}</div>
      </div>
    </div>
    {action}
  </motion.div>
);

const SettingsPanel: React.FC = () => {
  const [biometrics, setBiometrics] = useState(true);
  const [alerts, setAlerts] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="relative">
          <div className="w-32 h-32 neumorphic-pressed rounded-full p-1">
             <img src="https://picsum.photos/seed/elite/200" className="w-full h-full rounded-full grayscale object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 glass px-3 py-1 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-white pulse-liquid" />
             <span className="text-[8px] font-black uppercase tracking-tighter">ELITE</span>
          </div>
        </div>
        <div className="text-center md:text-left space-y-2">
           <h2 className="text-4xl font-black tracking-tighter uppercase">ARJUN KAPOOR</h2>
           <p className="text-gray-500 text-sm mono">Membership ID: SMP-9921-X</p>
           <div className="flex gap-4 pt-2">
              <div className="glass px-3 py-1 rounded-full text-[9px] font-bold text-gray-400 border-white/5 uppercase tracking-widest">KYC: Verified</div>
              <div className="glass px-3 py-1 rounded-full text-[9px] font-bold text-gray-400 border-white/5 uppercase tracking-widest">Nominee: Active</div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-6 mb-4">Security & Authentication</h3>
        <div className="neumorphic-flat rounded-[40px] border border-white/5 overflow-hidden">
          <SettingRow 
            icon={Shield} 
            label="Biometric Login" 
            sublabel="Access via FaceID / TouchID" 
            action={<Toggle active={biometrics} onToggle={() => setBiometrics(!biometrics)} />} 
          />
          <SettingRow 
            icon={Bell} 
            label="Real-time Alerts" 
            sublabel="Instant market volatility notifications" 
            action={<Toggle active={alerts} onToggle={() => setAlerts(!alerts)} />} 
          />
          <SettingRow 
            icon={User} 
            label="Two-Factor Auth" 
            sublabel="Manage TOTP configurations" 
            action={<ChevronRight size={18} className="text-gray-700" />} 
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest ml-6 mb-4">Financial Integration</h3>
        <div className="neumorphic-flat rounded-[40px] border border-white/5 overflow-hidden">
          <SettingRow 
            icon={CreditCard} 
            label="HDFC Bank • • 8821" 
            sublabel="Primary Investment Account (INR)" 
            action={<div className="w-2 h-2 rounded-full bg-white pulse-liquid mr-2" />} 
          />
          <SettingRow 
            icon={Zap} 
            label="Auto-Pay SIP" 
            sublabel="Manage e-Mandates for monthly wealth" 
            action={<ChevronRight size={18} className="text-gray-700" />} 
          />
        </div>
      </div>

      <button className="w-full h-20 glass rounded-[30px] border border-white/10 group hover:border-white/30 transition-all flex items-center justify-center gap-4 relative overflow-hidden">
        <motion.div 
           className="absolute inset-0 bg-white/5 -translate-y-full group-hover:translate-y-0 transition-transform duration-500"
        />
        <LogOut size={20} className="text-gray-500 group-hover:text-white transition-colors relative z-10" />
        <span className="text-lg font-black uppercase tracking-[0.3em] relative z-10">Dissolve Session</span>
      </button>

      <div className="text-center pt-10">
         <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.5em]">SAMPATTAI DESIGN SYSTEM • 2024</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
