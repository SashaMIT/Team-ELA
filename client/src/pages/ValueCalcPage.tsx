import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="p-4 sm:p-6 space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 shrink-0 mt-1" />
            <span className="leading-tight">Elastos Value Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-8">
            <div className="flex gap-2 mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 flex items-center gap-2 px-4 py-3 hover:bg-accent/50">
                    <Info className="w-5 h-5 text-blue-500" />
                    What is the Value Calculator?
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calculator className="w-6 h-6 text-blue-500" />
                      Understanding the Value Calculator
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="w-full">
                      <ValueJustificationViz />
                    </div>
                    <div className="text-muted-foreground space-y-2">
                      <p>
                        Calculate ELA's intrinsic value based on Bitcoin's security through merge mining. This tool analyzes Bitcoin mining rewards and Elastos' network share to derive a fundamental value proposition.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Features:</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Real-time data from blockchain.info API</li>
                          <li>Automatic updates every 5 minutes</li>
                          <li>Price movement indicators with 24h changes</li>
                          <li>Visual comparisons of current vs. estimated value</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 px-4 py-3 hover:bg-accent/50">
                    <BarChart2 className="w-5 h-5 text-purple-500" />
                    Calculation Methodology
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BarChart2 className="w-6 h-6 text-purple-500" />
                      Value Calculation Methodology
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-muted-foreground">
                    <h3 className="font-bold mb-2">🧮 How it's calculated:</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Bitcoin Mining Rewards:</strong> 3.125 BTC per block,
                        52,560 blocks per year = 164,250 BTC/year
                      </li>
                      <li>
                        <strong>Annual Value:</strong> 164,250 BTC × Current Bitcoin Price
                      </li>
                      <li>
                        <strong>Elastos Share:</strong> Annual Value × (Elastos Hashrate / Bitcoin Hashrate)
                      </li>
                      <li>
                        <strong>Per Token Value:</strong> Elastos Share ÷ Total
                        Supply (26.22M)
                      </li>
                    </ol>
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
                <div className="flex items-center justify-between">
                  <label className="font-medium">Bitcoin Hashrate:</label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{bitcoinHashrate.toFixed(2)} EH/s</span>
                    <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500 rounded-full" />
                    </div>
                    <span className="text-sm">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Elastos Hashrate:</label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{elastosHashrate.toFixed(2)} EH/s</span>
                    <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${(elastosHashrate/bitcoinHashrate) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Bitcoin Price:</label>
                  <div className="flex items-center gap-2">
                    <span>${bitcoinPrice.toLocaleString()}</span>
                    <span className={`flex items-center text-sm ${bitcoinPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {bitcoinPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {Math.abs(bitcoinPriceChange)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">ELA Price:</label>
                  <div className="flex items-center gap-2">
                    <span>${marketPrice.toFixed(2)}</span>
                    <span className={`flex items-center text-sm ${marketPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {marketPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
