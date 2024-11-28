import React, { useEffect, useState } from 'react';
import MergeMiningAnimation from '../components/MergeMiningAnimation';
import { useHashrateData } from '../hooks/useHashrateData';
import { useMarketCapData } from '../hooks/useMarketCapData';
import { ChevronUp, ChevronDown, Info, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const { data: hashrateData } = useHashrateData();

  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setShowDisclaimer(false);
  };
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elaPrice = hashrateData?.elaPrice ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const bitcoinPriceChange = hashrateData?.bitcoinPriceChange24h ?? 0;
  const elaPriceChange = hashrateData?.elaPriceChange24h ?? 0;

  const formatMarketCap = (value: number, isElastos = false) => {
    if (isElastos) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    return `$${(value / 1e9).toFixed(2)}B`;
  };

const { data: marketCapData } = useMarketCapData();
const bitcoinMarketCap = marketCapData?.bitcoinMarketCap ?? 0;
const elastosMarketCap = marketCapData?.elastosMarketCap ?? 0;

const stats: StatItem[] = [
    // Top row - Bitcoin stats
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
      label: "Bitcoin Market Cap",
      value: formatMarketCap(bitcoinMarketCap),
      showChange: false
    },
    {
      label: "Bitcoin Hashrate (EH/s)",
      value: bitcoinHashrate.toFixed(2),
      showChange: false
    },
    // Bottom row - Elastos stats
    {
      label: "Elastos Price",
      value: `$${elaPrice.toFixed(2)}`,
      change: elaPriceChange,
      showChange: true
    },
    {
      label: "Elastos Supply",
      value: "25.75 Million",
      showChange: false
    },
    {
      label: "Elastos Market Cap",
      value: formatMarketCap(elastosMarketCap, true),
      showChange: false
    },
    {
      label: "Elastos Hashrate (EH/s)",
      value: elastosHashrate.toFixed(2),
      subValue: `${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%`,
      showChange: false
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-1 sm:p-2">
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Financial Disclaimer
            </DialogTitle>
            <DialogDescription>
              Please read this important disclaimer before proceeding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <p>
              The information provided on this website is for general informational purposes only and should not be considered as financial advice.
            </p>
            <p>
              Cryptocurrency investments carry significant risks, including the possible loss of all invested capital. Historical performance is not indicative of future results.
            </p>
            <p>
              Always conduct your own research and consult with qualified financial advisors before making any investment decisions.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleAcceptDisclaimer} className="w-full">
              I Understand and Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="max-w-[1200px] w-full flex flex-col items-center space-y-2 px-2">
        <div className="w-full flex justify-center items-center">
          <MergeMiningAnimation />
        </div>
        
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full px-1 sm:px-2">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-accent/10 p-2 sm:p-3 lg:p-4 rounded-lg space-y-1 sm:space-y-2 text-center mx-auto w-full flex flex-col items-center"
            >
              <div className="flex items-center gap-1">
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                  {stat.label}
                </div>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild className="touch-auto">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="p-3 touch-auto">
                      <div className="text-sm">
                        {(stat.label.includes("Price") || stat.label.includes("Market Cap") || 
                          stat.label.includes("Supply")) && (
                          <a 
                            href={stat.label.includes("Bitcoin") 
                              ? "https://www.coingecko.com/en/coins/bitcoin"
                              : "https://www.coingecko.com/en/coins/elastos"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline p-1"
                          >
                            View data on CoinGecko
                          </a>
                        )}
                        {stat.label.includes("Hashrate") && stat.label.includes("Bitcoin") && (
                          <a 
                            href="https://api.minerstat.com/v2/coins?list=BTC&query=%7B%22method%22:%22GET%22,%22isArray%22:true%7D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline p-1"
                          >
                            View data on Minerstat
                          </a>
                        )}
                        {stat.label.includes("Hashrate") && !stat.label.includes("Bitcoin") && (
                          <a 
                            href="https://ela.elastos.io/api/v1/data-statistics"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline p-1"
                          >
                            View data on Elastos Explorer
                          </a>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-center w-full">
                {stat.label.includes("Hashrate") ? (
                  <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                    <span className="text-xs sm:text-sm">{stat.value}</span>
                    <div className="w-16 sm:w-20 lg:w-24 h-1.5 sm:h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ 
                          width: stat.label.includes("Bitcoin") ? '100%' : `${(elastosHashrate/bitcoinHashrate) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm whitespace-nowrap">
                      {stat.label.includes("Bitcoin") ? "100%" : stat.subValue}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-lg">{stat.value}</span>
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
