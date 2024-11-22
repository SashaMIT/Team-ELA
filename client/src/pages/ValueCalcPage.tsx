import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Calculator, DollarSign, BarChart2, Info } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        <CardContent>
          <div className="space-y-6">
            <Accordion type="single" collapsible>
              <AccordionItem value="about" className="border rounded-lg shadow-sm overflow-hidden bg-card">
                <AccordionTrigger className="px-4 py-3 hover:bg-accent/50">
                  <span className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                    <span className="leading-tight text-xl sm:text-2xl">
                      Elastos Value Calculator
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="border-t bg-accent/10 px-4 py-3">
                  <div className="text-muted-foreground space-y-4">
                    <p>
                      The Elastos Value Calculator helps estimate ELA's intrinsic value based on the security it inherits from Bitcoin through merge mining. By analyzing Bitcoin's mining rewards and Elastos' share of the total network hashrate, we can derive a fundamental value proposition for ELA.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Methodology:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Calculate annual Bitcoin mining rewards (BTC)</li>
                        <li>Convert rewards to USD using current Bitcoin price</li>
                        <li>Determine Elastos' share based on merge mining percentage</li>
                        <li>Divide by total ELA supply for per-token value</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Features:</h4>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Real-time data from blockchain.info API</li>
                        <li>Automatic updates every 5 minutes</li>
                        <li>Price movement indicators with 24h changes</li>
                        <li>Visual comparisons of current vs. estimated value</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="text-muted-foreground">
              Calculate ELA's value based on Bitcoin's mining security and Elastos' share through merged mining.
            </p>

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
                  <span>{bitcoinHashrate.toFixed(2)} EH/s</span>
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Elastos Hashrate:</label>
                  <span>{elastosHashrate.toFixed(2)} EH/s</span>
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

              <button
                onClick={() => setShowMethodology(!showMethodology)}
                className="w-full p-4 bg-accent/10 rounded-lg flex items-center justify-between hover:bg-accent/20 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  Calculation Methodology
                </span>
                {showMethodology ? <ChevronUp /> : <ChevronDown />}
              </button>

              {showMethodology && (
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">🧮 How it's calculated:</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
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
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueCalcPage;
