import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Lock, Bitcoin, TrendingUp, CheckCircle, Server, Zap, Database, LayersIcon, Scale, Award, Clock, Gem, Star, Building, ShoppingCart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHashrateData } from '../hooks/useHashrateData';

const BuyPage = () => {
  const [activeMetric, setActiveMetric] = React.useState('security');
  const [animatedHashrate, setAnimatedHashrate] = React.useState(0);
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;

  // ... Keep all existing animations and state logic ...

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      {/* Keep existing content up to Premium Investment Case */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b bg-blue-500 text-white">
          <CardTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <span className="text-2xl">Elastos (ELA): Bitcoin-Secured Digital Reserve Asset</span>
            </div>
            <div className="text-sm opacity-90 mt-2">
              {elastosHashrate.toFixed(2)} EH/s Security | Fixed 28.22M Supply | {((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}% Bitcoin Security
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Keep all existing content */}
          
          {/* New Exchange Section */}
          <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Where to Buy ELA
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Centralized Exchanges (CEX)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a href="https://www.coinbase.com/en-gb/advanced-trade/spot/ELA-USD" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 rounded-lg border hover:bg-blue-50 transition-colors">
                    <span className="text-xl">💱</span>
                    <span>Coinbase</span>
                  </a>
                  <a href="https://www.gate.io/trade/ELA_USDT" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 rounded-lg border hover:bg-blue-50 transition-colors">
                    <span className="text-xl">🌐</span>
                    <span>Gate.io</span>
                  </a>
                  <a href="https://www.kucoin.com/trade/ELA-USDT" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 rounded-lg border hover:bg-blue-50 transition-colors">
                    <span className="text-xl">🔄</span>
                    <span>KuCoin</span>
                  </a>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Decentralized Exchanges (DEX)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href="https://app.uniswap.org/#/swap?inputCurrency=0xe6fd75ff38adca4b97fbcd938c86b98772431867&outputCurrency=ETH" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 rounded-lg border hover:bg-purple-50 transition-colors">
                    <span className="text-xl">🦄</span>
                    <span>Uniswap</span>
                  </a>
                  <a href="https://dapp.chainge.finance/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 p-3 rounded-lg border hover:bg-purple-50 transition-colors">
                    <span className="text-xl">⚡</span>
                    <span>Chainge Finance</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyPage;
