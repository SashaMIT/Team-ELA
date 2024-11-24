import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';

const CompactCalcAnimation = () => {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const { data: hashrateData } = useHashrateData();
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 63796;
  
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAnimating]);

  const calculations = {
    blockReward: 3.125,
    blocksPerYear: 52560,
    annualBTC: 164250,
    btcPrice: bitcoinPrice,
    annualUSD: bitcoinPrice * 164250,
    elastosShare: 0.45,
    elastosValue: bitcoinPrice * 164250 * 0.45,
    elaSupply: 26220000,
    elaValue: (bitcoinPrice * 164250 * 0.45) / 26220000
  };

  const steps = [
    {
      label: "Annual BTC Rewards",
      formula: "3.125 × 52,560",
      result: "164,250 BTC",
      color: "orange"
    },
    {
      label: "USD Value",
      formula: `164,250 × $${bitcoinPrice.toLocaleString()}`,
      result: `$${(calculations.annualUSD / 1e9).toFixed(2)}B`,
      color: "green"
    },
    {
      label: "Elastos Share (45%)",
      formula: `$${(calculations.annualUSD / 1e9).toFixed(2)}B × 45%`,
      result: `$${(calculations.elastosValue / 1e9).toFixed(2)}B`,
      color: "blue"
    },
    {
      label: "Per Token Value",
      formula: `$${(calculations.elastosValue / 1e9).toFixed(2)}B ÷ 26.22M`,
      result: `$${calculations.elaValue.toFixed(2)}`,
      color: "purple"
    }
  ];

  return (
    <div className="w-full p-4 bg-accent/10 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">ELA Security Value</h2>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-3 py-1 text-sm bg-accent hover:bg-accent/80 rounded"
        >
          {isAnimating ? '⏸' : '▶️'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div 
              className={`transform transition-all duration-500 ${
                step >= i ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <div className="bg-accent/20 p-3 rounded-lg w-[120px]">
                <div className="text-xs mb-1">{s.label}</div>
                <div className="font-mono text-sm mb-1">{s.formula}</div>
                <div className="font-bold">{s.result}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className={`text-muted-foreground flex-shrink-0 transform transition-all duration-500 ${
                step > i ? 'opacity-100' : 'opacity-0'
              }`} size={16} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Animated lock particles showing security flow */}
      <div className="relative h-16 bg-gradient-to-r from-orange-100/50 via-blue-100/50 to-purple-100/50 rounded-lg overflow-hidden">
        {step >= 1 && Array.from({ length: 5 }).map((_, i) => (
          <Lock
            key={i}
            size={16}
            className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-1000 
              ${step >= 3 ? 'text-purple-500' : step >= 2 ? 'text-blue-500' : 'text-orange-500'}
            `}
            style={{
              left: `${(step * 25) - (i * 20)}%`,
              opacity: 0.8,
              animationDelay: `${i * 200}ms`
            }}
          />
        ))}
        <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
          Security Flow
        </div>
      </div>

      {step === 4 && (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Value derived from Bitcoin's mining security and 45% merge mining share
        </div>
      )}
    </div>
  );
};

export default CompactCalcAnimation;
