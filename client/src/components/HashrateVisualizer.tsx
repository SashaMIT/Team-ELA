import React, { useState, FC } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info } from "lucide-react";
import { Zap, Calculator, Cpu, Network, Server, Smartphone, Laptop, Building2, Monitor, Shield, Lock } from 'lucide-react';
import BlockVisualizer from './BlockVisualizer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import FriendlyHashrate from './FriendlyHashrate';
import HashScaleViz from './HashScaleViz';
import MergeMiningViz from './MergeMiningViz';
import { useHashrateData } from '../hooks/useHashrateData';

interface Scale {
  unit: string;
  buttonText?: string;
  base: number;
  icon: React.ReactNode;
  explanation: string;
  details: string[];
}

interface Scales {
  smartphones: Scale;
  computers: Scale;
  datacenters: Scale;
  supercomputers: Scale;
}

type ScaleType = keyof Scales;

const HashrateVisualizer = () => {
  const [selectedScale, setSelectedScale] = useState<ScaleType>('supercomputers');
  
  const scales: Scales = {
    supercomputers: {
      unit: "Frontier Supercomputers",
      buttonText: "Supercomputers",
      base: 1_500_000_000_000,
      icon: <Monitor className="w-5 h-5 text-orange-500" />,
      explanation: "Compared to Frontier, the world's fastest supercomputer (1.5 EH/s theoretical peak)",
      details: [
        "Frontier: 1.5 EH/s theoretical peak performance",
        "World's first exascale computing system",
        "Located at Oak Ridge National Laboratory"
      ]
    },
    datacenters: {
      unit: "Large data centers",
      buttonText: "Data Centers",
      base: 500_000_000_000,
      icon: <Building2 className="w-5 h-5 text-green-500" />,
      explanation: "Based on data center with 1000 servers with multiple GPUs",
      details: [
        "1 EH/s = 1,000,000,000,000 MH/s",
        "Data center hashrate: ~500 GH/s",
        "Based on enterprise-scale operation with 1000+ servers"
      ]
    },
    computers: {
      unit: "High-end gaming PCs",
      buttonText: "Gaming PCs",
      base: 160_000_000,
      icon: <Laptop className="w-5 h-5 text-purple-500" />,
      explanation: "Based on RTX 4090 (~140 MH/s) + CPU (~20 MH/s) for SHA-256",
      details: [
        "1 EH/s = 1,000,000,000,000 MH/s",
        "Gaming PC hashrate: ~160 MH/s (GPU + CPU)",
        "Equivalent to high-end PC with RTX 4090"
      ]
    },
    smartphones: {
      unit: "iPhone calculations",
      buttonText: "iPhones",
      base: 15_000_000,
      icon: <Smartphone className="w-5 h-5 text-blue-500" />,
      explanation: "Based on iPhone CPU performing SHA-256 hashes at ~15 MH/s",
      details: [
        "1 EH/s = 1,000,000,000,000 MH/s",
        "iPhone hashrate: ~15 MH/s per device",
        "Shows equivalent number of iPhones needed to match network power"
      ]
    }
  };

  const { data: hashrateData, isLoading, error } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-accent/20 rounded-lg w-3/4"></div>
            <div className="h-4 bg-accent/20 rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-red-500">
            Error loading hashrate data. Please try again later.
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

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
        <CardTitle className="flex items-start gap-2 text-lg sm:text-xl">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 shrink-0 mt-1" />
          <span className="leading-tight">
            Bitcoin and Elastos Network Computing Power
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Dialog Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent/50">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  What is Hashrate?
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="max-w-[95vw] sm:max-w-5xl p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[90vh] backdrop-blur-sm"
                aria-labelledby="hashrate-dialog-title"
                aria-describedby="hashrate-dialog-description"
              >
                <DialogHeader>
                  <DialogTitle id="hashrate-dialog-title">Understanding Hashrate</DialogTitle>
                  <DialogDescription id="hashrate-dialog-description">
                    Understand how network hashrate secures blockchain transactions and its vital role in maintaining network security
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
                  <div className="text-muted-foreground space-y-4 sm:space-y-6 lg:w-1/2 text-left">
                    <p className="text-sm sm:text-base">
                      Hashrate measures how quickly a computer or network can solve cryptographic puzzles called "hashes." In cryptocurrency networks, these puzzles secure the blockchain by verifying transactions and preventing tampering.
                    </p>
                    <p className="text-sm sm:text-base">
                      A higher hashrate means more computational power, making the network stronger and more secure against attacks, such as a 51% attack, where an entity could potentially control the network. This immense computational effort creates trust and ensures the network remains decentralized and tamper-proof.
                    </p>
                    <p className="text-sm sm:text-base">
                      Just as gold derives value from its scarcity and the effort required to mine it, cryptocurrency networks gain value from the energy and computing power securing them. Hashrate reflects not only security but also the overall health and activity of the network.
                    </p>
                  </div>
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="w-full max-w-[280px] sm:max-w-sm">
                      <FriendlyHashrate />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent/50">
                  <Cpu className="w-5 h-5 text-purple-500" />
                  What is EH/s?
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="max-w-[95vw] sm:max-w-2xl p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[90vh] backdrop-blur-sm"
                aria-labelledby="ehs-dialog-title"
                aria-describedby="ehs-dialog-description"
              >
                <DialogHeader>
                  <DialogTitle id="ehs-dialog-title">Understanding EH/s (ExaHashes per second)</DialogTitle>
                  <DialogDescription id="ehs-dialog-description">
                    Explore the measurement units used for quantifying network computing power and security strength
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-muted-foreground text-center">
                    <p className="text-sm sm:text-base mb-4">EH/s stands for ExaHashes per second. To understand how big this is:</p>
                    <div className="w-full max-w-[320px] sm:max-w-none mx-auto">
                      <HashScaleViz />
                    </div>
                    <p className="mt-4 text-sm sm:text-base">
                      So when we say Bitcoin's hashrate is {bitcoinHashrate} EH/s, it means the network is performing {bitcoinHashrate} quintillion calculations every second!
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2 px-4 py-3 hover:bg-accent/50">
                  <Network className="w-5 h-5 text-green-500" />
                  What is Merge Mining?
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="max-w-[95vw] sm:max-w-5xl p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[90vh] backdrop-blur-sm"
                aria-labelledby="merge-mining-dialog-title"
                aria-describedby="merge-mining-dialog-description"
              >
                <DialogHeader>
                  <DialogTitle id="merge-mining-dialog-title">Understanding Merge Mining</DialogTitle>
                  <DialogDescription id="merge-mining-dialog-description">
                    Discover how Elastos efficiently leverages Bitcoin's network security through advanced merge mining technology
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
                  <div className="text-muted-foreground space-y-4 sm:space-y-6 lg:w-1/2 text-left">
                    <p className="text-sm sm:text-base">Merge mining allows miners to mine multiple cryptocurrencies simultaneously without requiring additional computing power. Think of it like this:</p>
                    <ul className="list-disc ml-6 space-y-2 text-sm sm:text-base">
                      <li>When a miner solves a block for Bitcoin, they can reuse that same work to mine Elastos blocks</li>
                      <li>This means Elastos gets Bitcoin's security without requiring extra energy</li>
                      <li>It's like getting two rewards for doing one job</li>
                    </ul>
                    <p className="text-sm sm:text-base">
                      This is why Elastos's hashrate is so high - it's effectively borrowing roughly {((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}% of Bitcoin's massive mining power through merge mining!
                    </p>
                  </div>
                  <div className="w-full lg:w-1/2 max-w-[320px] sm:max-w-none mx-auto">
                    <MergeMiningViz />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Colored Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-orange-500" />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild className="touch-auto">
                      <div className="cursor-help">
                        <div className="text-sm text-gray-600">Bitcoin Hashrate</div>
                        <div className="font-bold text-lg">{bitcoinHashrate.toFixed(2)} EH/s</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-3 touch-auto">
                      <div className="text-sm">
                        <a 
                          href="https://api.minerstat.com/v2/coins?list=BTC&query=%7B%22method%22:%22GET%22,%22isArray%22:true%7D"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline p-1"
                        >
                          View Real-time Bitcoin Network Data on Minerstat
                        </a>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild className="touch-auto">
                      <div className="cursor-help">
                        <div className="text-sm text-gray-600">Elastos Hashrate</div>
                        <div className="font-bold text-lg">{elastosHashrate.toFixed(2)} EH/s</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-3 touch-auto">
                      <div className="text-sm">
                        <a 
                          href="https://ela.elastos.io/api/v1/data-statistics"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600 underline p-1"
                        >
                          View data on Elastos Explorer
                        </a>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild className="touch-auto">
                      <div className="cursor-help">
                        <div className="text-sm text-gray-600">Security Share</div>
                        <div className="font-bold text-lg">{((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-3 touch-auto">
                      <div className="text-sm">
                        <p>Percentage of Bitcoin's network security power utilized through merge mining with Elastos</p>
                        <div className="flex flex-col gap-2 mt-2">
                          <a 
                            href="https://api.minerstat.com/v2/coins?list=BTC&query=%7B%22method%22:%22GET%22,%22isArray%22:true%7D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline p-1"
                          >
                            View Bitcoin Network Data
                          </a>
                          <a 
                            href="https://ela.elastos.io/api/v1/data-statistics"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 underline p-1"
                          >
                            View Elastos Network Data
                          </a>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <BlockVisualizer />
          </div>

          <div className="space-y-4">
            <div className="font-medium flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              Compare to everyday devices:
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-6 px-1">
              {(Object.entries(scales) as [ScaleType, Scale][]).map(([key, { icon, unit, explanation }]) => (
                <TooltipProvider key={key} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedScale === key ? "default" : "outline"}
                        onClick={() => setSelectedScale(key)}
                        className={cn(
                          "w-full gap-2 min-h-[2.5rem] px-2 py-1",
                          selectedScale === key && "shadow-lg"
                        )}
                      >
                        <span>{scales[key].icon}</span>
                        <span className="text-sm truncate">{scales[key].buttonText || unit}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="p-3 touch-auto">
                      <div className="text-sm space-y-2">
                        <p>{explanation}</p>
                        {key === 'supercomputers' && (
                          <>
                            <p>Comparison details:</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Peak Performance: 1.5 EH/s</li>
                              <li>First exascale system</li>
                              <li>Located at Oak Ridge Lab</li>
                            </ul>
                            <a 
                              href="https://www.olcf.ornl.gov/frontier/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block mt-2 text-blue-500 hover:text-blue-600 underline p-1"
                            >
                              Learn more about Frontier
                            </a>
                          </>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            <div className="space-y-4">
              <motion.div 
                className="relative h-28 bg-gradient-to-r from-orange-100/50 to-orange-50/50 rounded-lg overflow-hidden shadow-md border border-orange-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full flex items-center justify-between p-3">
                  <div className="flex-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-1">
                            <div className="font-bold text-lg flex items-center gap-2">
                              Bitcoin Network
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground" aria-label="Data from blockchain.info API" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">Data from blockchain.info API</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-primary">
                              {formatNumber(calculateEquivalent(bitcoinHashrate, scales[selectedScale].base))} {scales[selectedScale].unit}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm">{bitcoinHashrate.toFixed(2)} EH/s</span>
                              <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-green-500 rounded-full" />
                              </div>
                              <span className="text-sm">100%</span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" sideOffset={5} className="max-w-[250px]">
                          <p className="text-sm">Bitcoin's network hashrate represents the total computing power securing the blockchain. Higher hashrate means better security.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="relative h-28 bg-gradient-to-r from-blue-100/50 to-blue-50/50 rounded-lg overflow-hidden shadow-md border border-blue-200/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="h-full flex items-center justify-between p-3">
                  <div className="flex-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-1">
                            <div className="font-bold text-lg flex items-center gap-2">
                              Elastos Network
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground" aria-label="Data from ela.elastos.io/api/v1/data-statistics API" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">Data from ela.elastos.io/api/v1/data-statistics API</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-primary">
                              {formatNumber(calculateEquivalent(elastosHashrate, scales[selectedScale].base))} {scales[selectedScale].unit}
                            </div>
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
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" sideOffset={5} className="max-w-[250px]">
                          <p className="text-sm">Elastos leverages merge mining with Bitcoin, sharing about 48% of Bitcoin's hashrate for enhanced security without additional energy consumption.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="bg-accent/10 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">
                {selectedScale === 'supercomputers' ? (
                  `Equivalent to ${formatNumber(calculateEquivalent(bitcoinHashrate, scales[selectedScale].base))} ${scales[selectedScale].unit}`
                ) : (
                  `Network power equivalent to ${formatNumber(calculateEquivalent(bitcoinHashrate, scales[selectedScale].base))} ${scales[selectedScale].unit}`
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {scales[selectedScale].details.map((detail, index) => (
                  <div key={index}>{detail}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HashrateVisualizer;