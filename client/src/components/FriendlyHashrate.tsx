import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Lock, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHashrateData } from '../hooks/useHashrateData';

const FriendlyHashrate = () => {
  const [locks, setLocks] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    rotation: number;
    opacity: number;
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocks(prev => {
        const filtered = prev.filter(p => p.y < 400);
        const newLocks = [...Array(3)].map(() => ({
          id: Date.now() + Math.random(),
          x: Math.random() * containerWidth,
          y: -20,
          size: Math.random() * 12 + 8,
          speed: Math.random() * 4 + 3,
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.6
        }));
        return [...filtered, ...newLocks];
      });
    }, 50);

    return () => clearInterval(interval);
  }, [containerWidth]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setLocks(prev => 
        prev.map(lock => ({
          ...lock,
          y: lock.y + lock.speed,
          rotation: lock.rotation + 1
        }))
      );
    }, 16);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
          Bitcoin's Network Security
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild className="touch-auto">
                <Info className="inline-block w-4 h-4 ml-2 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="p-3 touch-auto">
                <div className="text-sm space-y-2">
                  <p>Live Bitcoin network security metrics provided by Minerstat</p>
                  <a 
                    href="https://minerstat.com/coin/BTC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-500 hover:text-blue-600 underline p-1"
                  >
                    View on Minerstat
                  </a>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
        <p className="text-gray-600 mt-2 flex items-center gap-2">
          {bitcoinHashrate.toFixed(2)} EH/s = {(bitcoinHashrate * 1e18).toLocaleString()} hashes per second 🔒
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild className="touch-auto">
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="p-3 touch-auto">
                <div className="text-sm space-y-2">
                  <p>Network hashrate is updated every 5 minutes with verified blockchain data</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative h-64 bg-gradient-to-b from-blue-100/50 to-orange-100/30 rounded-xl overflow-hidden border border-blue-200"
      >
        <div className="absolute bottom-4 w-full flex justify-around">
          {[...Array(5)].map((_, i) => (
            <Cpu key={i} size={32} className="text-orange-400 animate-pulse" style={{
              animationDelay: `${i * 200}ms`
            }} />
          ))}
        </div>

        {locks.map(lock => (
          <div
            key={lock.id}
            className="absolute transition-all duration-100"
            style={{
              transform: `translate(${lock.x}px, ${lock.y}px) rotate(${lock.rotation}deg)`,
              opacity: lock.opacity
            }}
          >
            <Lock 
              size={lock.size} 
              className="text-yellow-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendlyHashrate;
