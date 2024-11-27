import React from 'react';
import MergeMiningAnimation from '../components/MergeMiningAnimation';
import { useHashrateData } from '../hooks/useHashrateData';
import { useMarketCapData } from '../hooks/useMarketCapData';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';
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
  const { data: hashrateData } = useHashrateData();
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
      value: "28.22 Million",
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs sm:text-sm space-y-1">
                        <p>
                          {stat.label.includes("Bitcoin") ? (
                            stat.label.includes("Price") ? 
                              "Real-time Bitcoin price data with 5-minute updates from " :
                            stat.label.includes("Supply") ?
                              "Verified Bitcoin protocol supply information via " :
                            stat.label.includes("Market Cap") ?
                              "Real-time market capitalization calculations using data from " :
                              "Bitcoin network hashrate metrics provided by "
                          ) : (
                            stat.label.includes("Price") ?
                              "Real-time Elastos price data with 5-minute updates from " :
                            stat.label.includes("Supply") ?
                              "Current Elastos circulating supply verified by " :
                            stat.label.includes("Market Cap") ?
                              "Real-time Elastos market capitalization from " :
                              "Elastos network hashrate metrics from "
                          )}
                          {(stat.label.includes("Price") || stat.label.includes("Market Cap") || 
                            (stat.label.includes("Supply") && !stat.label.includes("Bitcoin"))) && (
                            <a 
                              href={stat.label.includes("Bitcoin") 
                                ? "https://www.coingecko.com/en/coins/bitcoin"
                                : "https://www.coingecko.com/en/coins/elastos"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              CoinGecko
                            </a>
                          )}
                          {stat.label.includes("Hashrate") && stat.label.includes("Bitcoin") && (
                            <a 
                              href="https://api.blockchain.info/stats"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              Blockchain.info
                            </a>
                          )}
                          {stat.label.includes("Hashrate") && !stat.label.includes("Bitcoin") && (
                            <a 
                              href="https://ela.elastos.io/api/v1/data-statistics"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              Elastos Explorer
                            </a>
                          )}
                        </p>
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
