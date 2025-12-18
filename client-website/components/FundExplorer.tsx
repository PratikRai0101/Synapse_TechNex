import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader } from 'lucide-react';
import { fetchTopSchemes, ProcessedFund } from '../utils/fundApi';
import FundDetailView from './FundDetailView';

const FundExplorer: React.FC = () => {
  const [funds, setFunds] = useState<ProcessedFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'1y' | '3y' | '5y'>('1y');
  const [selectedFund, setSelectedFund] = useState<ProcessedFund | null>(null);

  useEffect(() => {
    const loadFunds = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('=== FUND LOADING STARTED ===');

        // Fetch top schemes from Synapse API
        console.log('Fetching top schemes from Synapse API...');
        const topSchemes = await fetchTopSchemes();
        console.log(`✓ Fetched ${topSchemes.length} schemes`);
        
        if (topSchemes.length === 0) {
          console.error('✗ No schemes returned - API may be unavailable');
          setError('Unable to fetch mutual funds. Please check your internet connection and try again.');
          setLoading(false);
          return;
        }

        console.log(`=== LOADING COMPLETE: ${topSchemes.length} funds ready ===`);
        
        // Set all funds at once
        setFunds(topSchemes);
      } catch (err) {
        console.error('Fatal error:', err);
        setError('An error occurred while loading funds. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadFunds();
  }, []);

  // Get return value based on selected period
  const getReturnValue = (fund: ProcessedFund): number => {
    switch (selectedPeriod) {
      case '1y':
        return fund.returns1y;
      case '3y':
        return fund.returns3y;
      case '5y':
        return fund.returns5y;
      default:
        return fund.returns3y;
    }
  };

  // Filter funds based on category
  const filteredFunds = funds.filter((fund) => {
    if (filter === 'All') return true;
    if (filter === 'High Growth') return fund.risk === 'High' || fund.risk === 'Very High';
    if (filter === 'Low Risk') return fund.risk === 'Low' || fund.risk === 'Moderate';
    if (filter === 'Large Cap') return fund.category.toLowerCase().includes('large');
    return true;
  });

  if (error) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-[var(--text)]">Market Explorer</h2>
          </div>
        </div>
        <div className="glass p-10 rounded-[28px] border border-[var(--border)]">
          <p className="text-[var(--text-muted)] text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-[var(--text)]">Market Explorer</h2>
            <p className="text-[var(--text-muted)] max-w-xl text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Discover elite capital pools within the obsidian framework. {loading ? 'Loading...' : `${filteredFunds.length} funds available`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader className="animate-spin text-[var(--text)]" size={32} />
              <p className="text-[var(--text-muted)] text-sm">Loading mutual fund data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFunds.map((fund) => (
                <div
                  key={fund.id}
                  onClick={() => setSelectedFund(fund)}
                  className="group glass hover:bg-[var(--text)]/[0.08] transition-all duration-500 rounded-[28px] p-8 border border-[var(--border)] hover:border-[var(--text)]/30 flex flex-col gap-6 cursor-pointer hover:shadow-[0_20px_60px_rgba(128,128,128,0.15)]"
                >
                  {/* Fund Icon/Image */}
                  <div className="w-16 h-16 rounded-[20px] glass border border-[var(--border)] flex items-center justify-center transition-all duration-700 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:shadow-[0_0_20px_rgba(128,128,128,0.2)]">
                    <img
                      src={`https://picsum.photos/seed/${fund.amc}/100`}
                      alt={fund.amc}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Fund Name & Category */}
                  <div className="space-y-2">
                    <h3 className="font-black text-base uppercase tracking-tight text-[var(--text)] line-clamp-2">
                      {fund.name}
                    </h3>
                    <div className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-widest">
                      {fund.category.split('-').slice(0, 2).join(' • ')}
                    </div>
                  </div>

                  {/* Current NAV */}
                  <div className="space-y-2 border-t border-[var(--border)] pt-4">
                    <div className="text-[8px] text-[var(--text-dim)] font-bold uppercase tracking-widest">Current NAV</div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black mono text-[var(--text)]">
                        ₹{fund.nav.toFixed(2)}
                      </div>
                      {/* Return Indicator */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border transition-all
                        ${getReturnValue(fund) >= 0 
                          ? 'border-green-500/30 bg-green-500/5' 
                          : 'border-red-500/30 bg-red-500/5'}`}>
                        <div className={`w-2 h-2 rounded-full ${getReturnValue(fund) >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold mono tracking-wider ${getReturnValue(fund) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {getReturnValue(fund) >= 0 ? '+' : ''}{getReturnValue(fund).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-[8px] pt-4 border-t border-[var(--border)]">
                    <div className="space-y-1">
                      <div className="text-[var(--text-dim)] font-bold uppercase tracking-widest">Risk</div>
                      <div className="text-[9px] font-black text-[var(--text)]">{fund.risk}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[var(--text-dim)] font-bold uppercase tracking-widest">Alpha</div>
                      <div className="text-[9px] font-black text-[var(--text)]">+{fund.alpha.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFund(fund);
                    }}
                    className="w-full py-3 bg-[var(--text)] text-[var(--bg)] text-[9px] font-black uppercase tracking-widest rounded-[16px] hover:shadow-[0_10px_30px_rgba(128,128,128,0.3)] transition-all opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fund Detail Modal */}
      {selectedFund && (
        <FundDetailView fund={selectedFund} onClose={() => setSelectedFund(null)} />
      )}
    </>
  );
};

export default FundExplorer;