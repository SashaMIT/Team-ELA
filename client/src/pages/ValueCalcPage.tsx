import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Calculator, DollarSign, BarChart2 } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';

const ValueCalcPage = () => {
  // Calculator state
  const [showMethodology, setShowMethodology] = useState(false);
  const [marketPrice, setMarketPrice] = useState(1.78);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [potentialUpside, setPotentialUpside] = useState(0);
  const [bitcoinPrice, setBitcoinPrice] = useState(69585);

  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 671.05;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 48.52;

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
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <span className="leading-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Elastos Value Calculator
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
              <div>
                <label className="block mb-2 font-medium">
                  Bitcoin Price (USD): ${bitcoinPrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  value={bitcoinPrice}
                  onChange={(e) => setBitcoinPrice(Number(e.target.value))}
                  className="w-full h-2 bg-accent/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Current Market Price:</label>
                  <input
                    type="number"
                    value={marketPrice}
                    onChange={(e) => setMarketPrice(Number(e.target.value))}
                    className="w-24 p-2 border rounded"
                  />
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
