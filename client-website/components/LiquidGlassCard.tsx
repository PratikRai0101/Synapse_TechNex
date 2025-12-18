import React from 'react';

const LiquidGlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--border)] rounded-[32px] shadow-2xl transition-all duration-400 ${className}`}>
    {children}
  </div>
);

export default LiquidGlassCard;