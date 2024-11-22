import React from 'react';
import NetworkSphere from '../components/NetworkSphere';
import { useHashrateData } from '../hooks/useHashrateData';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HomePage = () => {
  const { data: hashrateData } = useHashrateData();
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elaPrice = hashrateData?.elaPrice ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const bitcoinPriceChange = hashrateData?.bitcoinPriceChange24h ?? 0;
  const elaPriceChange = hashrateData?.elaPriceChange24h ?? 0;

  const stats = [
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
      label: "Bitcoin Hashrate",
      value: `${bitcoinHashrate.toFixed(2)} EH/s`,
      showChange: false
    },
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
      label: "Elastos Hashrate",
      value: `${elastosHashrate.toFixed(2)} EH/s`,
      subValue: `${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%`,
      showChange: false
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="max-w-[800px] w-full flex flex-col items-center space-y-8 px-4">
        <div className="max-w-[250px] w-full">
          <NetworkSphere />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to the Elastos SmartWeb
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px]">
            Elastos (ELA) leverages Bitcoin's hash rate and decentralized architecture to build a secure, user-owned internet, empowering data control and fulfilling Satoshi Nakamoto's vision of innovation anchored to Bitcoin's security. Congratulations. You're early.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="stats" className="border rounded-lg shadow-sm overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:bg-accent/50">
              <span className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5" />
                Network Statistics
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bitcoin Stats */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bitcoin Price</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${bitcoinPrice.toLocaleString()}</span>
                        {typeof bitcoinPriceChange === 'number' && (
                          <span className={`flex items-center text-sm ${bitcoinPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {bitcoinPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {Math.abs(bitcoinPriceChange)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Supply</span>
                        <span className="font-semibold">21 Million</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Hashrate</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">{bitcoinHashrate.toFixed(2)} EH/s</span>
                        <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-green-500 rounded-full" />
                        </div>
                        <span className="text-sm">100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elastos Stats */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Elastos Price</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${elaPrice.toFixed(2)}</span>
                        {typeof elaPriceChange === 'number' && (
                          <span className={`flex items-center text-sm ${elaPriceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {elaPriceChange >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {Math.abs(elaPriceChange)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Supply</span>
                        <span className="font-semibold">28.22 Million</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Hashrate</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">{elastosHashrate.toFixed(2)} EH/s</span>
                        <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${(elastosHashrate/bitcoinHashrate) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm">{((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default HomePage;
