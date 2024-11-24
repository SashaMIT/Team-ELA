import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Lock } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';

interface Lock {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
  opacity: number;
  type: 'bitcoin' | 'elastos';
}

const MergeMiningViz = () => {
  const [locks, setLocks] = useState<Lock[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const securityPercentage = ((elastosHashrate/bitcoinHashrate) * 100).toFixed(1);

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
        const newLocks = [...Array(2)].map(() => {
          const x = Math.random() * (containerWidth - 100);
          return [
            {
              id: Date.now() + Math.random(),
              x: x,
              y: -20,
              size: Math.random() * 12 + 8,
              speed: Math.random() * 4 + 3,
              rotation: Math.random() * 360,
              opacity: Math.random() * 0.4 + 0.6,
              type: 'bitcoin'
            },
            {
              id: Date.now() + Math.random() + 1,
              x: x,
              y: -20,
              size: Math.random() * 12 + 8,
              speed: Math.random() * 4 + 3,
              rotation: Math.random() * 360,
              opacity: Math.random() * 0.4 + 0.6,
              type: 'elastos'
            }
          ];
        }).flat();
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
          x: lock.type === 'elastos' && lock.y > 150 ? 
            lock.x + (lock.y - 150) * 0.5 : lock.x,
          rotation: lock.rotation + 1
        }))
      );
    }, 16);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-background to-background/50 rounded-xl">
      <div 
        ref={containerRef}
        className="relative h-80 bg-gradient-to-b from-accent/20 to-accent/5 rounded-xl overflow-hidden"
      >
        {/* Network labels */}
        <div className="absolute bottom-24 w-full flex justify-between px-8">
          <div className="text-orange-500 font-bold">Bitcoin Network</div>
          <div className="text-blue-500 font-bold">Elastos Network</div>
        </div>

        {/* CPUs representing mining power */}
        <div className="absolute bottom-4 w-full flex justify-between px-8">
          <div className="flex space-x-2">
            <Cpu size={32} className="text-orange-400 animate-pulse" />
            <Cpu size={32} className="text-orange-400 animate-pulse" style={{ animationDelay: '200ms' }} />
            <Cpu size={32} className="text-orange-400 animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
          <div className="flex space-x-2">
            <Cpu size={32} className="text-blue-400 animate-pulse" />
            <Cpu size={32} className="text-blue-400 animate-pulse" style={{ animationDelay: '200ms' }} />
          </div>
        </div>

        {/* Divider showing work split */}
        <div className="absolute top-1/3 left-1/2 h-2/3 border-r-2 border-dashed border-accent" />

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
              className={lock.type === 'bitcoin' ? 'text-orange-500' : 'text-blue-500'}
            />
          </div>
        ))}

        {/* Hashrate indicator */}
        <div className="absolute top-4 right-4 bg-card/90 rounded-lg p-2 text-sm">
          <div className="text-orange-500">Bitcoin Hashrate: {bitcoinHashrate.toFixed(2)} EH/s</div>
          <div className="text-blue-500">Elastos Security: {securityPercentage}%</div>
        </div>
      </div>
    </div>
  );
};

export default MergeMiningViz;