import React, { useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';

const HashScaleViz = () => {
  const [selectedScale, setSelectedScale] = useState('H');
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  
  const scales = [
    { symbol: 'H', name: 'Hash', power: 0, color: 'emerald' },
    { symbol: 'MH', name: 'MegaHash', power: 6, color: 'blue' },
    { symbol: 'GH', name: 'GigaHash', power: 9, color: 'purple' },
    { symbol: 'TH', name: 'TeraHash', power: 12, color: 'violet' },
    { symbol: 'PH', name: 'PetaHash', power: 15, color: 'pink' },
    { symbol: 'EH', name: 'ExaHash', power: 18, color: 'orange' }
  ];

  const getCurrentScale = () => {
    return scales.find(s => s.symbol === selectedScale);
  };

  const renderLocks = () => {
    const scale = getCurrentScale();
    const count = Math.min(10, Math.pow(2, scales.indexOf(scale)));
    
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i} 
            className="relative group transition-all duration-300"
          >
            <Lock 
              className={`text-${scale.color}-500 transition-all duration-300 animate-pulse`}
              style={{
                animationDelay: `${i * 100}ms`,
              }}
              size={24 + scales.indexOf(scale) * 4}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-gradient-to-b from-blue-50 to-background rounded-xl">
      {/* Scale Selection */}
      <div className="flex justify-between items-center mb-6 overflow-x-auto py-2 px-1">
        {scales.map((scale, index) => (
          <div 
            key={scale.symbol}
            className="flex items-center"
          >
            <button
              onClick={() => setSelectedScale(scale.symbol)}
              className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-all duration-300 ${
                selectedScale === scale.symbol 
                  ? `bg-${scale.color}-100 ring-2 ring-${scale.color}-500` 
                  : 'hover:bg-accent/50'
              }`}
            >
              <span className={`text-base font-bold text-${scale.color}-500`}>
                {scale.symbol}
              </span>
              <span className="text-xs text-muted-foreground">
                10^{scale.power}
              </span>
            </button>
            {index < scales.length - 1 && (
              <ChevronRight className="text-muted-foreground mx-1" size={16} />
            )}
          </div>
        ))}
      </div>

      {/* Visualization Area */}
      <div className="bg-card/50 rounded-lg p-4 shadow-inner min-h-[160px]">
        <div className="text-center mb-4">
          <span className={`text-lg font-bold text-${getCurrentScale().color}-500`}>
            1 {getCurrentScale().name}
          </span>
          <span className="text-muted-foreground"> = </span>
          <span className="font-mono">
            1{Array(getCurrentScale().power).fill('0').join('')}
          </span>
          <span className="text-muted-foreground"> calculations</span>
        </div>
        
        {renderLocks()}
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {getCurrentScale().symbol === 'EH' && (
            <div className="text-orange-500 font-bold animate-pulse">
              Bitcoin's current hashrate: {bitcoinHashrate.toFixed(2)} EH/s
              <div className="text-xs text-muted-foreground mt-1">
                That's {(bitcoinHashrate * 1e18).toLocaleString()} calculations every second!
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Each step represents a 1000x increase in computational power
      </div>
    </div>
  );
};

export default HashScaleViz;
