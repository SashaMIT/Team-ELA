import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ExternalLink, ShoppingCart, Building2, Wallet } from 'lucide-react';

const BuyElaPage = () => {
  const exchanges = {
    cex: [
      { name: 'Huobi', url: 'https://www.huobi.com/en-us/exchange/ela_usdt' },
      { name: 'Gate.io', url: 'https://www.gate.io/trade/ELA_USDT' },
      { name: 'KuCoin', url: 'https://www.kucoin.com/trade/ELA-USDT' }
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
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b bg-blue-500 text-white">
          <CardTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <ShoppingCart className="h-8 w-8" />
              <span className="text-2xl">Buy Elastos (ELA)</span>
            </div>
            <div className="text-sm opacity-90 mt-2">
              Multiple options to acquire ELA through trusted exchanges
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Centralized Exchanges Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="text-blue-500" />
                Centralized Exchanges (CEX)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exchanges.cex.map((exchange, index) => (
                  <a
                    key={index}
                    href={exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="p-6 bg-white rounded-lg border-2 border-blue-100 hover:border-blue-500 
                                  transition-all duration-300 hover:shadow-lg group">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{exchange.name}</span>
                        <ExternalLink className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 
                                               transition-opacity duration-300" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Decentralized Exchanges Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Wallet className="text-green-500" />
                Decentralized Exchanges (DEX)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exchanges.dex.map((exchange, index) => (
                  <a
                    key={index}
                    href={exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="p-6 bg-white rounded-lg border-2 border-green-100 hover:border-green-500 
                                  transition-all duration-300 hover:shadow-lg group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg">{exchange.name}</span>
                        <ExternalLink className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 
                                               transition-opacity duration-300" />
                      </div>
                      <p className="text-sm text-gray-600">{exchange.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Important Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Always verify you're on the official exchange website</li>
                <li>Keep your private keys and passwords secure</li>
                <li>Consider hardware wallets for long-term storage</li>
                <li>Research the exchange's reputation and security measures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyElaPage;
