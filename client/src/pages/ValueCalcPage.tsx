import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Calculator, DollarSign, BarChart2, Info } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CompactCalcAnimation from '../components/CompactCalcAnimation';
import ValueJustificationViz from '../components/ValueJustificationViz';

const ValueCalcPage = () => {
  // Calculator state
  const [showMethodology, setShowMethodology] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [potentialUpside, setPotentialUpside] = useState(0);
  const { data: hashrateData, isLoading, error } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 671.05;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 48.52;
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
  const marketPrice = hashrateData?.elaPrice ?? 1.78;
  const bitcoinPriceChange = hashrateData?.bitcoinPriceChange24h ?? 0;
  const marketPriceChange = hashrateData?.elaPriceChange24h ?? 0;

  const elaSupply = 26.22; // ELA supply in millions

  useEffect(() => {
    calculateELAValue();
  }, [bitcoinPrice, bitcoinHashrate, elastosHashrate, marketPrice]);

  const calculateELAValue = () => {
    const btcBlockReward = 3.125;
    const blocksPerYear = 52560;
    const annualBTCRewards = btcBlockReward * blocksPerYear;
    const annualUSDRewards = annualBTCRewards * bitcoinPrice;
    const elastosHashpowerValue = (annualUSDRewards * (elastosHashrate / bitcoinHashrate));
    const elaValue = elastosHashpowerValue / (elaSupply * 1000000);
    setEstimatedValue(elaValue);
    setPotentialUpside(((elaValue / marketPrice - 1) * 100));
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6 w-full">
      <Card className="w-full bg-background/95 backdrop-blur-sm mx-auto">
        <CardHeader className="p-2 sm:p-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0 mt-1" />
            <span className="leading-tight">Elastos Value Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4 sm:space-y-8 px-2 sm:px-0">
            {/* Dialog buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    What is the Value Calculator?
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-4xl p-2 sm:p-4 md:p-6 overflow-y-auto max-h-[90vh] backdrop-blur-sm mx-auto" aria-labelledby="calculator-dialog-title" aria-describedby="calculator-dialog-description">
                  <DialogHeader>
                    <DialogTitle id="calculator-dialog-title" className="text-lg sm:text-xl">Understanding the Value Calculator</DialogTitle>
                    <DialogDescription id="calculator-dialog-description">
                      Learn how the Value Calculator determines ELA's intrinsic value based on Bitcoin's security through merge mining
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 sm:space-y-6">
                    <ValueJustificationViz />
                    <div className="space-y-3 sm:space-y-4 px-1 sm:px-2">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        The Value Calculator determines ELA's intrinsic value based on Bitcoin's security through merge mining. This tool analyzes Bitcoin mining rewards and Elastos' network share to derive a fundamental value proposition.
                      </p>
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm sm:text-base text-muted-foreground mb-3">Key Features:</h4>
                        <ul className="grid grid-cols-1 gap-3 sm:gap-2">
                          <li className="flex items-center gap-3 p-2 sm:p-1 bg-blue-50/50 rounded-lg text-xs sm:text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            Real-time blockchain.info API integration
                          </li>
                          <li className="flex items-center gap-3 p-2 sm:p-1 bg-blue-50/50 rounded-lg text-xs sm:text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            5-minute automatic data updates
                          </li>
                          <li className="flex items-center gap-3 p-2 sm:p-1 bg-blue-50/50 rounded-lg text-xs sm:text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            24-hour price movement tracking
                          </li>
                          <li className="flex items-center gap-3 p-2 sm:p-1 bg-blue-50/50 rounded-lg text-xs sm:text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            Dynamic merge mining calculations
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-green-500" />
                    Value Calculation Methodology
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="w-full sm:max-w-4xl p-2 sm:p-4 md:p-6 overflow-y-auto max-h-[90vh] backdrop-blur-sm"
                  aria-labelledby="methodology-dialog-title"
                  aria-describedby="methodology-dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle id="methodology-dialog-title" className="text-lg sm:text-xl">Value Calculation Methodology</DialogTitle>
                    <DialogDescription id="methodology-dialog-description">
                      Understand how we calculate ELA's value based on Bitcoin's security metrics and merge mining data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 sm:space-y-6">
                    <CompactCalcAnimation />
                    <div className="text-muted-foreground px-1 sm:px-2">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">🧮 How it's calculated:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                            <div>
                              <strong>Bitcoin Mining Rewards:</strong>
                              <div className="text-sm">3.125 BTC × 52,560 blocks = 164,250 BTC/year</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                            <div>
                              <strong>Annual Value:</strong>
                              <div className="text-sm">164,250 BTC × Current Bitcoin Price</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <div>
                              <strong>Elastos Share:</strong>
                              <div className="text-sm">Annual Value × (Elastos Hashrate / Bitcoin Hashrate)</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                            <div>
                              <strong>Per Token Value:</strong>
                              <div className="text-sm">Elastos Share ÷ Total Supply (26.22M)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Value Display */}
            <div className="bg-accent/10 p-4 sm:p-6 rounded-lg text-xl sm:text-2xl font-bold text-center mb-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                <span>{estimatedValue.toFixed(2)}</span>
              </div>
              <div className="text-lg text-green-600">
                Potential Upside: {potentialUpside.toFixed(2)}%
              </div>
            </div>

            {/* Metrics Display */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                {/* Bitcoin Hashrate */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-medium flex items-center gap-2">
                    Bitcoin Hashrate:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            Real-time Bitcoin network hashrate data provided by{' '}
                            <a 
                              href="https://blockchain.info/q/hashrate"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              Blockchain.info API
                            </a>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-sm sm:text-base min-w-[80px]">{bitcoinHashrate.toFixed(2)} EH/s</span>
                    <div className="w-24 sm:w-32 h-3 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500 rounded-full" />
                    </div>
                    <span className="text-sm sm:text-base min-w-[40px]">100%</span>
                  </div>
                </div>

                {/* Elastos Hashrate */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-medium flex items-center gap-2">
                    Elastos Hashrate:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            Real-time Elastos network hashrate data provided by{' '}
                            <a 
                              href="https://ela.elastos.io/api/v1/block/height/0"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              Elastos.io API
                            </a>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-sm sm:text-base min-w-[80px]">{elastosHashrate.toFixed(2)} EH/s</span>
                    <div className="w-24 sm:w-32 h-3 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${(elastosHashrate/bitcoinHashrate) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm sm:text-base min-w-[40px]">{((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Bitcoin Price */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-medium flex items-center gap-2">
                    Bitcoin Price:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            Price data from{' '}
                            <a 
                              href="https://www.coingecko.com/en/coins/bitcoin"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              CoinGecko
                            </a>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base">${bitcoinPrice.toLocaleString()}</span>
                    <span className={`flex items-center gap-1 text-sm ${bitcoinPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bitcoinPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {Math.abs(bitcoinPriceChange)}%
                    </span>
                  </div>
                </div>

                {/* ELA Price */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-medium flex items-center gap-2">
                    ELA Price:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            Price data from{' '}
                            <a 
                              href="https://www.coingecko.com/en/coins/elastos"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              CoinGecko
                            </a>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base">${marketPrice.toFixed(2)}</span>
                    <span className={`flex items-center gap-1 text-sm ${marketPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marketPriceChange >= 0 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      {Math.abs(marketPriceChange)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueCalcPage;