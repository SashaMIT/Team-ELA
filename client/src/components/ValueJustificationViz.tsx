import React, { useState, useEffect } from 'react';
import { Lock, DollarSign } from 'lucide-react';
import { useHashrateData } from '../hooks/useHashrateData';

interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  phase?: 'mining' | 'security';
  value?: number;
}

const ValueJustificationViz = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [valueParticles, setValueParticles] = useState<Particle[]>([]);
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const elaPrice = hashrateData?.elaPrice ?? 0;
  const securityPercentage = ((elastosHashrate/bitcoinHashrate) * 100).toFixed(1);
  
  // Generate security particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const filtered = prev.filter(p => p.y < 600 && p.opacity > 0);
        return [...filtered, {
          id: Date.now(),
          x: 150 + Math.random() * 50,
          y: -20,
          speed: 2 + Math.random() * 2,
          size: 8 + Math.random() * 6,
          opacity: 0.6,
          phase: 'mining',
          value: Math.random() * 100
        }];
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Generate value indicator particles
  useEffect(() => {
    const interval = setInterval(() => {
      setValueParticles(prev => {
        const filtered = prev.filter(p => p.x < 600 && p.opacity > 0);
        return [...filtered, {
          id: Date.now(),
          x: -20,
          y: 200 + Math.random() * 50,
          speed: 1 + Math.random() * 1,
          size: 16,
          opacity: 0.8
        }];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Update particles
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => {
          let newX = particle.x;
          let newOpacity = particle.opacity;
          let newPhase = particle.phase;
          let newSize = particle.size;

          if (particle.y > 200 && newPhase === 'mining') {
            newPhase = 'security';
            newX += (Math.random() - 0.5) * 50;
          }
          
          if (particle.y > 400) {
            newOpacity -= 0.02;
            newSize *= 1.02;
          }

          return {
            ...particle,
            y: particle.y + particle.speed,
            x: newX,
            phase: newPhase,
            opacity: newOpacity,
            size: newSize
          };
        })
      );

      setValueParticles(prev =>
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.speed,
          opacity: particle.x > 400 ? particle.opacity - 0.02 : particle.opacity
        }))
      );
    }, 16);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-background to-background/50 rounded-xl">
      <div className="relative h-[300px] bg-gradient-to-b from-accent/20 to-accent/5 rounded-xl overflow-hidden">
        {/* Integrated Stats */}
        <div className="absolute inset-x-0 top-0 px-4 py-2 bg-black/5 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-orange-600 font-mono text-sm">{bitcoinHashrate.toFixed(2)} EH/s</div>
              <div className="text-orange-800 text-xs">Bitcoin Mining</div>
            </div>
            <div>
              <div className="text-blue-600 font-mono text-sm">{elastosHashrate.toFixed(2)} EH/s</div>
              <div className="text-blue-800 text-xs">{securityPercentage}% Security</div>
            </div>
          </div>
          <div>
            <div className="text-purple-600 font-mono text-sm">${elaPrice.toFixed(2)}</div>
            <div className="text-purple-800 text-xs">ELA Price</div>
          </div>
        </div>

        {/* Value Flow Labels */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-accent/10 flex flex-col justify-around p-4">
          <div className="text-sm text-muted-foreground">
            <h4 className="font-bold">Secure Network</h4>
            <p>Bitcoin's massive hashrate provides unmatched security</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <h4 className="font-bold">Shared Security</h4>
            <p>Elastos inherits {securityPercentage}% of Bitcoin's security through merge mining</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <h4 className="font-bold">Value Translation</h4>
            <p>Security translates to network value and token price support</p>
          </div>
        </div>

        {/* Flowing Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute transition-all duration-100"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              opacity: particle.opacity,
            }}
          >
            <Lock 
              size={particle.size}
              className={`
                ${particle.phase === 'mining' ? 'text-orange-500' : ''}
                ${particle.phase === 'security' ? 'text-blue-500' : ''}
                animate-pulse
              `}
            />
          </div>
        ))}

        {/* Value Indicators */}
        {valueParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute transition-all duration-100"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              opacity: particle.opacity,
            }}
          >
            <DollarSign 
              size={particle.size}
              className="text-purple-500 animate-pulse"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueJustificationViz;
