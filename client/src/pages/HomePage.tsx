import React from 'react';
import NetworkSphere from '../components/NetworkSphere';
import { useHashrateData } from '../hooks/useHashrateData';
import { ChevronUp, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const { data: hashrateData } = useHashrateData();
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elaPrice = hashrateData?.elaPrice ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const bitcoinPriceChange = hashrateData?.bitcoinPriceChange24h ?? 0;
  const elaPriceChange = hashrateData?.elaPriceChange24h ?? 0;

  const stats = [
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
      label: "Bitcoin Hashrate",
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
      label: "Elastos Hashrate",
      value: `${elastosHashrate.toFixed(2)} EH/s`,
      subValue: `${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%`,
      showChange: false
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-[800px] w-full flex flex-col items-center space-y-8 px-4">
        <div className="max-w-[250px] w-full">
          <NetworkSphere />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to the Elastos SmartWeb
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px]">
            Elastos (ELA) leverages Bitcoin's hash rate and decentralized architecture to build a secure, user-owned internet, empowering data control and fulfilling Satoshi Nakamoto's vision of innovation anchored to Bitcoin's security. Congratulations. You're early.
          </p>
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
                <div className="font-semibold text-lg">
                  {stat.value}
                </div>
                {stat.showChange && (
                  <span className={`flex items-center text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {Math.abs(stat.change)}%
                  </span>
                )}
                {stat.subValue && (
                  <span className="text-sm text-muted-foreground">
                    {stat.subValue}
                  </span>
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
