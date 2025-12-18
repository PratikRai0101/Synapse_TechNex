import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Wallet, 
  ArrowLeftRight, 
  Bookmark, 
  Settings, 
  Bell, 
  Search,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskReturnGalaxy from './components/RiskReturnGalaxy';
import WealthRing from './components/WealthRing';
import FundExplorer from './components/FundExplorer';
import WealthVault from './components/WealthVault';
import SwitchInterface from './components/SwitchInterface';
import SavedGallery from './components/SavedGallery';
import SettingsPanel from './components/SettingsPanel';
import SarthiInterface from './components/SarthiInterface';
import Hero from './components/Hero';
import ChatWidget from './components/ChatWidget';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-4 px-2 w-full transition-all duration-300 group
      ${active ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
  >
    <div className={`p-2 rounded-xl transition-all duration-300 ${active ? 'bg-[var(--text)]/10 shadow-[0_0_15px_rgba(128,128,128,0.2)]' : 'group-hover:bg-[var(--text)]/5'}`}>
      <Icon size={18} />
    </div>
    <span className="text-[8px] mt-2 font-bold tracking-widest uppercase">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 pb-20">
            <Hero onStartInvesting={() => setActiveTab('explore')} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                {/* PerformanceChart now requires real data from API */}
                <div className="glass p-10 h-[500px] rounded-[28px] border border-[var(--border)] flex items-center justify-center">
                  <p className="text-[var(--text-muted)] text-center">
                    Chart displays when exploring funds or from your portfolio. Click "Explore" to get started!
                  </p>
                </div>
              </div>
              <div className="lg:col-span-4">
                <WealthVault compact />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <RiskReturnGalaxy />
               <WealthRing />
            </div>
          </div>
        );
      case 'explore':
        return <FundExplorer />;
      case 'portfolio':
        return <WealthVault />;
      case 'switch':
        return <SwitchInterface />;
      case 'saved':
        return <SavedGallery />;
      case 'sarthi':
        return <SarthiInterface />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex font-inter transition-colors duration-500">
      {/* Sidebar */}
      <nav className="w-20 border-r border-[var(--border)] flex flex-col items-center py-10 fixed h-full z-50 bg-[var(--bg)] transition-colors duration-500">
        <div className="w-10 h-10 rounded-2xl bg-[var(--text)] flex items-center justify-center mb-16 shadow-[0_0_30px_rgba(128,128,128,0.2)]">
          <div className="w-5 h-5 border-2 border-[var(--bg)] rounded-sm rotate-45" />
        </div>
        
        <div className="flex-1 w-full space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Vault" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Compass} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          <SidebarItem icon={Wallet} label="Wealth" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
          <SidebarItem icon={ArrowLeftRight} label="Switch" active={activeTab === 'switch'} onClick={() => setActiveTab('switch')} />
          <SidebarItem icon={Bookmark} label="Gallery" active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
          <SidebarItem icon={Sparkles} label="Sarthi" active={activeTab === 'sarthi'} onClick={() => setActiveTab('sarthi')} />
        </div>

        <SidebarItem icon={Settings} label="Control" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>

      {/* Main Content */}
      <main className="ml-20 flex-1 relative min-h-screen">
        <header className="sticky top-0 z-40 px-10 py-6 flex items-center justify-between glass border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter uppercase">SAMPATTAI</h1>
            <div className="px-2 py-0.5 rounded bg-[var(--text)]/10 text-[7px] font-bold text-[var(--text-muted)]">V1.0.2</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={14} />
              <input 
                type="text" 
                placeholder="Find wealth opportunities..." 
                className="bg-[var(--text)]/5 border border-[var(--border)] rounded-full py-2 pl-10 pr-6 w-72 focus:outline-none focus:ring-1 focus:ring-[var(--text)]/30 focus:bg-[var(--text)]/10 transition-all text-xs text-[var(--text)]"
              />
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full neumorphic-flat hover:scale-105 transition-all text-[var(--text)]"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="text-[var(--text-muted)] hover:text-[var(--text)] transition-all relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-1 h-1 bg-[var(--text)] rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full glass p-0.5 border border-[var(--border)]">
              <img src="https://picsum.photos/seed/elite/100" alt="Avatar" className="w-full h-full rounded-full object-cover grayscale" />
            </div>
          </div>
        </header>

        <div className="px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <ChatWidget />
      </main>
    </div>
  );
};

export default App;