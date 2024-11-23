import React from 'react';
import MergeMiningAnimation from '../components/MergeMiningAnimation';
import { useHashrateData } from '../hooks/useHashrateData';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change?: number;
  showChange?: boolean;
  subValue?: string;
  isHashrate?: boolean;
  percentage?: number;
}

const HomePage = () => {
  const { data: hashrateData } = useHashrateData();
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elaPrice = hashrateData?.elaPrice ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const bitcoinPriceChange = hashrateData?.bitcoinPriceChange24h ?? 0;
  const elaPriceChange = hashrateData?.elaPriceChange24h ?? 0;

  const stats: StatItem[] = [
    {
      label: "Bitcoin Price",
      value: `$${bitcoinPrice.toLocaleString()}`,
      change: bitcoinPriceChange,
      showChange: true
    },
    {
      label: "Bitcoin Supply",
      value: "21 Million",
      showChange: false
    },
    {
      label: "Bitcoin Hashrate (EH/s)",
      value: `${bitcoinHashrate.toFixed(2)} EH/s`,
      showChange: false
    },
    {
      label: "Elastos Price",
      value: `$${elaPrice.toFixed(2)}`,
      change: elaPriceChange,
      showChange: true
    },
    {
      label: "Elastos Supply",
      value: "28.22 Million",
      showChange: false
    },
    {
      label: "Elastos Hashrate (EH/s)",
      value: `${elastosHashrate.toFixed(2)} EH/s`,
      subValue: `${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%`,
      showChange: false
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-1 sm:p-2">
      <div className="max-w-[1200px] w-full flex flex-col items-center space-y-2 px-2">
        <div className="w-full">
          <MergeMiningAnimation />
        </div>
        
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-accent/10 p-4 rounded-lg space-y-2"
            >
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
              <div className="flex items-center justify-between">
                {stat.label.includes("Hashrate") ? (
                  <div className="flex items-center gap-4 w-full">
                    <span>{stat.value}</span>
                    <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: stat.label.includes("Bitcoin") ? '100%' : `${(elastosHashrate/bitcoinHashrate) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm">
                      {stat.label.includes("Bitcoin") ? "100%" : stat.subValue}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{stat.value}</span>
                    {stat.showChange && typeof stat.change === 'number' && (
                      <span className={`flex items-center text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {Math.abs(stat.change)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
