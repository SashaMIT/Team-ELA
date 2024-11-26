import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Lock, Bitcoin, Star, Wallet, ExternalLink } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BuyElaPage = () => {
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const [animatedHashrate, setAnimatedHashrate] = useState(0);

  const realHashrateData = [
    { year: '2018', hashrate: 22, btcHashrate: 101, percentage: "21.8%" },
    { year: '2020', hashrate: 120, btcHashrate: 250, percentage: "48%" },
    { year: '2022', hashrate: 240, btcHashrate: 450, percentage: "53.3%" },
    { year: '2024', hashrate: elastosHashrate, btcHashrate: bitcoinHashrate, percentage: ((elastosHashrate/bitcoinHashrate) * 100).toFixed(1) + "%" }
  ];

  const exchanges = {
    cex: [
      { name: 'Coinbase', url: 'https://www.coinbase.com/en-gb/advanced-trade/spot/ELA-USD' },
      { name: 'KuCoin', url: 'https://www.kucoin.com/trade/ELA-USDT?rcode=e21sNJ' },
      { name: 'Gate.io', url: 'https://www.gate.io/trade/ELA_USDT?ref=3018394' },
      { name: 'Huobi', url: 'https://www.huobi.com/en-us/trade/ELA_USDT' },
      { name: 'Bitget', url: 'https://www.bitget.com/spot/ELAUSDT/?channelCode=42xn&vipCode=sq59&languageType=0' },
      { name: 'Crypto.com', url: 'https://crypto.com/exchange/trade/ELA_USD' }
    ],
    dex: [
      { 
        name: 'Uniswap', 
        url: 'https://app.uniswap.org/#/swap?outputCurrency=0xe6fd75ff38adca4b97fbcd938c86070c3dabd5b9',
        description: 'Trade ELA on Ethereum network'
      },
      { 
        name: 'Chainge Finance', 
        url: 'https://dapp.chainge.finance/',
        description: 'Cross-chain trading with Force Bridge'
      },
      { 
        name: 'Glide Finance', 
        url: 'https://glidefinance.io/swap',
        description: 'Elastos Sidechain DEX'
      }
    ]
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = elastosHashrate / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= elastosHashrate) {
        setAnimatedHashrate(elastosHashrate);
        clearInterval(timer);
      } else {
        setAnimatedHashrate(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [elastosHashrate]);

  return (
    <div className="w-full h-full bg-white p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="p-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="flex flex-col">
              <span>Bitcoin-Secured Digital Reserve Asset</span>
              <span className="text-sm font-normal text-muted-foreground">
                {elastosHashrate} EH/s Security | Fixed 28.22M Supply | {((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}% Bitcoin Security
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <Shield className="inline text-blue-500 h-4 w-4 mb-1" />
              <div className="text-sm font-bold">{animatedHashrate.toFixed(2)} EH/s</div>
              <div className="text-xs text-gray-600">Security Power</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg text-center">
              <Lock className="inline text-purple-500 h-4 w-4 mb-1" />
              <div className="text-sm font-bold">28.22M</div>
              <div className="text-xs text-gray-600">Max Supply</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <Star className="inline text-green-500 h-4 w-4 mb-1" />
              <div className="text-sm font-bold">3.29%</div>
              <div className="text-xs text-gray-600">APY</div>
            </div>
          </div>

          {/* Security Power Bar */}
          <div className="bg-blue-50 p-2 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Security Share:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(elastosHashrate/bitcoinHashrate) * 100}%` }}
                  />
                </div>
                <span className="text-xs">{((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Wallet Download Box */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-medium">Download Essentials Wallet</h3>
            </div>
            <a
              href="https://apps.apple.com/us/app/web3-essentials-crypto-wallet/id1568931743"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-white text-blue-600 hover:bg-blue-50 px-2 py-1 rounded border border-blue-200 transition-colors"
            >
              Essentials for iOS
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Buy ELA Box */}
          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-black-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-green-500" />
              Buy ELA
            </h3>
            <div className="grid gap-3">
              <div>
                <h4 className="text-xs font-medium text-black-600 mb-1">Centralized Exchanges</h4>
                <div className="flex flex-wrap gap-2">
                  {exchanges.cex.map((exchange) => (
                    <a
                      key={exchange.name}
                      href={exchange.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-white text-green-600 hover:bg-green-50 px-2 py-1 rounded border border-green-200 transition-colors"
                    >
                      {exchange.name}
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-black-600 mb-1">Decentralized Exchanges</h4>
                <div className="flex flex-wrap gap-2">
                  {exchanges.dex.map((exchange) => (
                    <a
                      key={exchange.name}
                      href={exchange.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-white text-green-600 hover:bg-green-50 px-2 py-1 rounded border border-green-200 transition-colors"
                      title={exchange.description}
                    >
                      {exchange.name}
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Split Columns: Benefits and Chart */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Left Column: Security & Supply Benefits */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg h-[300px] overflow-auto">
              <h3 className="text-sm font-bold mb-2">Security & Supply Benefits</h3>
              <div className="grid gap-3">
                <div>
                  <h4 className="text-xs font-semibold mb-1">Security Leadership</h4>
                  <ul className="space-y-1">
                    {[
                      "Bitcoin-level security at fraction of energy cost",
                      `Highest merge-mining participation (${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%+)`,
                      `${elastosHashrate} EH/s of protection and growing`,
                      "6+ years of proven security"
                    ].map((point, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 shrink-0" />
                        <span className="text-xs opacity-90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-1">Supply Certainty</h4>
                  <ul className="space-y-1">
                    {[
                      "Fixed maximum supply of 28.22M tokens",
                      "Final supply reached by 2105",
                      "Mathematically guaranteed cap",
                      "Transparent emission schedule"
                    ].map((point, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 shrink-0" />
                        <span className="text-xs opacity-90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Security Integration Chart */}
            <div className="bg-white rounded-lg border p-2 h-[300px]">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Security Integration
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={realHashrateData}>
                  <XAxis dataKey="year" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="btcHashrate" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.1}
                    name="Bitcoin Network"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hashrate" 
                    stroke="#2563eb" 
                    fill="#2563eb"
                    fillOpacity={0.2}
                    name="Elastos Security"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-accent/10 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Elastos combines the world's strongest security infrastructure ({elastosHashrate} EH/s) with 
              a guaranteed fixed supply (28.22M by 2105), creating a premium store of value 
              secured by Bitcoin's network while consuming only a fraction of the energy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyElaPage;