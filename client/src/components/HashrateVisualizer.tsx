import React, { useState, FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Zap, Calculator, Cpu, Network, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Scale {
  unit: string;
  buttonText?: string;
  base: number;
  icon: string;
  explanation: string;
  details: string[];
}

interface Scales {
  smartphones: Scale;
  computers: Scale;
  datacenters: Scale;
}

interface DropdownSectionProps {
  title: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

type ScaleType = keyof Scales;
const HashrateVisualizer: FC = () => {
  const [selectedScale, setSelectedScale] = useState<ScaleType>('smartphones');
  const [showEHS, setShowEHS] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  
  const scales: Scales = {
    smartphones: {
      unit: "iPhone calculations",
      buttonText: "iPhone calculations per second",
      base: 15_000_000,
      icon: "📱",
      explanation: "Based on iPhone CPU performing SHA-256 hashes at ~15 MH/s",
      details: [
        "1 EH/s = 1,000,000,000,000 MH/s",
        "iPhone hashrate: ~15 MH/s per device",
        "Shows equivalent number of iPhones needed to match network power"
      ]
    },
    computers: {
      unit: "High-end gaming PCs",
      base: 160_000_000,
      icon: "💻",
      explanation: "Based on RTX 4090 (~140 MH/s) + CPU (~20 MH/s) for SHA-256",
      details: [
        "1 EH/s = 1,000,000,000,000 MH/s",
        "Gaming PC hashrate: ~160 MH/s (GPU + CPU)",
        "Equivalent to high-end PC with RTX 4090"
      ]
    },
    datacenters: {
      unit: "Large data centers",
      base: 500_000_000_000,
      icon: "🏢",
      explanation: "Based on data center with 1000 servers with multiple GPUs",
      details: [
        "1 EH/s = 1,000,000,000,000 MH/s",
        "Data center hashrate: ~500 GH/s",
        "Based on enterprise-scale operation with 1000+ servers"
      ]
    }
  };

  const DropdownSection: FC<DropdownSectionProps> = ({ title, isOpen, setIsOpen, children }) => (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center hover:bg-accent/50 transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t bg-accent/10"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const bitcoinHashrate = 671.05;
  const elastosHashrate = 341.94;

  const calculateEquivalent = (hashrate: number, base: number): number => {
    return (hashrate * 1_000_000_000_000) / base;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000_000) {
      return `${(num / 1_000_000_000_000).toFixed(1)} trillion`;
    }
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(1)} billion`;
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)} million`;
    }
    return num.toLocaleString();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="p-4 sm:p-6 space-y-2">
        <CardTitle className="flex items-start gap-2 text-xl sm:text-2xl">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 shrink-0 mt-1" />
          <span className="leading-tight bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            The Mind-Blowing Scale of Bitcoin and Elastos' Computing Power
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2 flex items-center gap-2 text-lg">
                <Calculator className="w-5 h-5 text-blue-500" />
                What is Hashrate?
              </h3>
              <div className="text-muted-foreground space-y-2">
                <p>
                  Hashrate is the speed at which a computer can make calculations. In cryptocurrency networks, these calculations are called "hashes" - think of them like extremely complex math puzzles that computers solve to secure the network.
                </p>
                <p>
                  This massive computational power is crucial as it provides the foundation for a robust reserve asset. Just like gold's scarcity and the difficulty in mining it gives it value, the enormous computing power securing these networks makes them virtually impossible to manipulate or attack, establishing their credibility as digital reserve assets.
                </p>
              </div>
            </div>
            
            <DropdownSection 
              title={
                <span className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  What is EH/s?
                </span>
              }
              isOpen={showEHS}
              setIsOpen={setShowEHS}
            >
              <div className="text-muted-foreground">
                <p>EH/s stands for ExaHashes per second. To understand how big this is:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>1 Hash = 1 calculation</li>
                  <li>1 MegaHash (MH) = 1 million hashes</li>
                  <li>1 GigaHash (GH) = 1 billion hashes</li>
                  <li>1 TeraHash (TH) = 1 trillion hashes</li>
                  <li>1 PetaHash (PH) = 1,000 trillion hashes</li>
                  <li>1 ExaHash (EH) = 1,000,000 trillion hashes</li>
                </ul>
                <p className="mt-2">
                  So when we say Bitcoin's hashrate is {bitcoinHashrate} EH/s, it means the network is performing {bitcoinHashrate} quintillion calculations every second!
                </p>
              </div>
            </DropdownSection>

            <DropdownSection
              title={
                <span className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-green-500" />
                  What is Merge Mining?
                </span>
              }
              isOpen={showMerge}
              setIsOpen={setShowMerge}
            >
              <div className="text-muted-foreground">
                <p>Merge mining allows miners to mine multiple cryptocurrencies simultaneously without requiring additional computing power. Think of it like this:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>When a miner solves a block for Bitcoin, they can reuse that same work to mine Elastos blocks</li>
                  <li>This means Elastos gets Bitcoin's security without requiring extra energy</li>
                  <li>It's like getting two rewards for doing one job</li>
                </ul>
                <p className="mt-2">
                  This is why Elastos's hashrate is so high - it's effectively borrowing roughly 48% of Bitcoin's massive mining power through merge mining!
                </p>
              </div>
            </DropdownSection>
          </div>

          <div className="space-y-4">
            <div className="font-medium flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              Compare to everyday devices:
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              {(Object.entries(scales) as [ScaleType, Scale][]).map(([key, { icon, unit }]) => (
                <Button
                  key={key}
                  variant={selectedScale === key ? "default" : "outline"}
                  onClick={() => setSelectedScale(key)}
                  className={cn(
                    "flex-1 gap-2",
                    selectedScale === key && "shadow-lg"
                  )}
                >
                  <span>{icon}</span>
                  <span className="text-sm">{scales[key].buttonText || unit}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <motion.div 
                className="relative h-36 sm:h-24 bg-accent/10 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4 text-black font-medium">
                    <div className="font-bold text-lg mb-1">Bitcoin Network</div>
                    <div className="text-sm sm:text-base break-words pr-2">
                      {formatNumber(calculateEquivalent(bitcoinHashrate, scales[selectedScale].base))} {scales[selectedScale].unit}
                    </div>
                    <div className="text-xs sm:text-sm mt-1">{bitcoinHashrate} EH/s</div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="relative h-36 sm:h-24 bg-accent/10 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${(elastosHashrate/bitcoinHashrate) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="p-4 text-black font-medium">
                    <div className="font-bold text-lg mb-1">Elastos Network</div>
                    <div className="text-sm sm:text-base break-words pr-2">
                      {formatNumber(calculateEquivalent(elastosHashrate, scales[selectedScale].base))} {scales[selectedScale].unit}
                    </div>
                    <div className="text-xs sm:text-sm mt-1">{elastosHashrate} EH/s</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="bg-accent/10 p-4 rounded-lg">
            <div className="font-medium mb-2">{scales[selectedScale].explanation}</div>
            <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
              {scales[selectedScale].details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HashrateVisualizer;
