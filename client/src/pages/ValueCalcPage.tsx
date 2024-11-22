import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator, DollarSign, BarChart2, ChevronUp, ChevronDown, Info } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ValueCalcProps {}

const ValueCalcPage: React.FC<ValueCalcProps> = () => {
  const { data: hashrateData, isLoading, error } = useHashrateData();
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [potentialUpside, setPotentialUpside] = useState(0);
  
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-accent/20 rounded-lg w-3/4"></div>
              <div className="h-4 bg-accent/20 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <div className="text-red-500">Error loading data. Please try again later.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Value Calculator
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Value Display Card */}
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 p-8 rounded-lg shadow-lg">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <DollarSign className="w-8 h-8 text-green-500" />
                <span className="text-3xl font-bold">${estimatedValue.toFixed(2)}</span>
              </div>
              <div className="text-xl font-medium text-green-600">
                Potential Upside: {potentialUpside.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <Accordion type="multiple" className="space-y-4">
            {/* About Section */}
            <AccordionItem value="about" className="border rounded-lg overflow-hidden shadow-sm">
              <AccordionTrigger className="px-4 py-4 hover:bg-accent/50 transition-colors">
                <span className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">About the Calculator</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t bg-accent/10 p-6 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    The Elastos Value Calculator helps estimate ELA's intrinsic value based on the security it inherits from Bitcoin through merge mining. By analyzing Bitcoin's mining rewards and Elastos' share of the total network hashrate, we can derive a fundamental value proposition for ELA.
                  </p>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Key Features:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Real-time data from blockchain.info API</li>
                      <li>Automatic updates every 5 minutes</li>
                      <li>Price movement indicators with 24h changes</li>
                      <li>Visual comparisons of current vs. estimated value</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Network Stats Section */}
            <AccordionItem value="stats" className="border rounded-lg overflow-hidden shadow-sm">
              <AccordionTrigger className="px-4 py-4 hover:bg-accent/50 transition-colors">
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Network Statistics</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t bg-gradient-to-br from-purple-500/5 via-accent/10 to-purple-500/5 p-6">
                  <div className="bg-background/80 p-6 rounded-lg space-y-5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <label className="font-medium">Bitcoin Hashrate:</label>
                      <span className="font-mono">{bitcoinHashrate.toFixed(2)} EH/s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-medium">Elastos Hashrate:</label>
                      <span className="font-mono">{elastosHashrate.toFixed(2)} EH/s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-medium">Bitcoin Price:</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">${bitcoinPrice.toLocaleString()}</span>
                        <span className={`flex items-center gap-1 text-sm font-medium ${bitcoinPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bitcoinPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {Math.abs(bitcoinPriceChange)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="font-medium">ELA Price:</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">${marketPrice.toFixed(2)}</span>
                        <span className={`flex items-center gap-1 text-sm font-medium ${marketPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {marketPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {Math.abs(marketPriceChange)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Methodology Section */}
            <AccordionItem value="methodology" className="border rounded-lg overflow-hidden shadow-sm">
              <AccordionTrigger className="px-4 py-4 hover:bg-accent/50 transition-colors">
                <span className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Calculation Methodology</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="border-t bg-accent/10 p-6 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    🧮 <span>How it's calculated:</span>
                  </h3>
                  <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                    <li className="leading-relaxed">
                      <strong>Bitcoin Mining Rewards:</strong> 3.125 BTC per block,
                      52,560 blocks per year = 164,250 BTC/year
                    </li>
                    <li className="leading-relaxed">
                      <strong>Annual Value:</strong> 164,250 BTC × Current Bitcoin Price
                    </li>
                    <li className="leading-relaxed">
                      <strong>Elastos Share:</strong> Annual Value × (Elastos Hashrate / Bitcoin Hashrate)
                    </li>
                    <li className="leading-relaxed">
                      <strong>Per Token Value:</strong> Elastos Share ÷ Total
                      Supply (26.22M)
                    </li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueCalcPage;
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueCalcPage;
