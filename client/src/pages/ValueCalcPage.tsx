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
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="max-w-3xl mx-auto bg-background/95 backdrop-blur-sm">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0 mt-1" />
            <span className="leading-tight">Elastos Value Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-500" />
                    What is the Value Calculator?
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Understanding the Value Calculator</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <ValueJustificationViz />
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        The Value Calculator determines ELA's intrinsic value based on Bitcoin's security through merge mining. This tool analyzes Bitcoin mining rewards and Elastos' network share to derive a fundamental value proposition.
                      </p>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Key Features:</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Real-time blockchain.info API integration
                          </li>
                          <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            5-minute automatic data updates
                          </li>
                          <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            24-hour price movement tracking
                          </li>
                          <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
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
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Value Calculation Methodology</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <CompactCalcAnimation />
                    <div className="text-muted-foreground">
                      <h4 className="font-semibold mb-2">🧮 How it's calculated:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            
            <div className="bg-accent/10 p-6 rounded-lg text-2xl font-bold text-center mb-4 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-6 h-6 text-green-500" />
                <span>{estimatedValue.toFixed(2)}</span>
              </div>
              <div className="text-lg text-green-600">
                Potential Upside: {potentialUpside.toFixed(2)}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-medium flex items-center gap-2">
                    Bitcoin Hashrate:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Hashrate data from blockchain.info API</p>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-medium flex items-center gap-2">
                    Elastos Hashrate:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Hashrate data from blockchain.info API</p>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <label className="font-medium flex items-center gap-2 text-sm sm:text-base">
                    Bitcoin Price:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Price data from CoinGecko API</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-medium">${bitcoinPrice.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      bitcoinPriceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bitcoinPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="text-xs font-medium">{Math.abs(bitcoinPriceChange)}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <label className="font-medium flex items-center gap-2 text-sm sm:text-base">
                    ELA Price:
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="p-1">
                            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Price data from CoinGecko API</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg font-medium">${marketPrice.toFixed(2)}</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      marketPriceChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {marketPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      <span className="text-xs font-medium">{Math.abs(marketPriceChange)}%</span>
                    </div>
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
