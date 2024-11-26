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
  phase: 'mining' | 'security';
  value: number;
}

interface ValueParticle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

const ValueJustificationViz = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [valueParticles, setValueParticles] = useState<ValueParticle[]>([]);
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;
  const bitcoinPrice = hashrateData?.bitcoinPrice ?? 0;
  const elaPrice = hashrateData?.elaPrice ?? 0;
  const securityPercentage = ((elastosHashrate/bitcoinHashrate) * 100).toFixed(1);

  // Generate security particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const filtered = prev.filter(p => p.y < 600 && p.opacity > 0);
        const securityRatio = elastosHashrate / bitcoinHashrate;
        return [...filtered, {
          id: Date.now(),
          x: 150 + Math.random() * 100,
          y: -20,
          speed: 2 + Math.random() * 2 * securityRatio,
          size: (14 + Math.random() * 8) * (securityRatio * 0.8 + 0.2),
          opacity: 0.9 * (securityRatio * 0.5 + 0.5),
          phase: 'mining',
          value: Math.random() * 100
        }];
      });
    }, Math.max(100, 200 * (1 - elastosHashrate / bitcoinHashrate)));

    return () => clearInterval(interval);
  }, [elastosHashrate, bitcoinHashrate]);

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
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-6 bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg">
      <div className="text-center mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Value Proposition</h2>
        <p className="text-xs sm:text-base text-gray-600">Bitcoin Security → Elastos Value</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
        {/* Stats Panel */}
        <div className="w-full sm:w-1/4 grid grid-cols-3 sm:grid-cols-1 gap-2">
          <div className="bg-orange-100 p-3 sm:p-4 rounded-lg">
            <h3 className="text-orange-800 font-bold text-sm sm:text-base">Bitcoin Mining</h3>
            <div className="text-orange-600 font-mono text-sm sm:text-base">{bitcoinHashrate.toFixed(2)} EH/s</div>
            <div className="text-orange-600 text-xs sm:text-sm">Network Power</div>
          </div>

          <div className="bg-blue-100 p-3 sm:p-4 rounded-lg">
            <h3 className="text-blue-800 font-bold text-sm sm:text-base">Elastos Share</h3>
            <div className="text-blue-600 font-mono text-sm sm:text-base">{elastosHashrate.toFixed(2)} EH/s</div>
            <div className="text-blue-600 text-xs sm:text-sm">{securityPercentage}% Security</div>
          </div>

          <div className="bg-purple-100 p-3 sm:p-4 rounded-lg">
            <h3 className="text-purple-800 font-bold text-sm sm:text-base">ELA Value</h3>
            <div className="text-purple-600 font-mono text-sm sm:text-base">${elaPrice.toFixed(2)}</div>
            <div className="text-purple-600 text-xs sm:text-sm">Market Price</div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="flex-1 relative h-[200px] sm:h-[330px] bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden border border-gray-200">
          {/* Value Flow Labels */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-1/3 bg-gradient-to-r from-transparent to-gray-50/50 flex flex-col justify-around p-2 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-600">
              <h4 className="font-bold">Secure Network</h4>
              <p className="text-xs sm:text-sm">Bitcoin's massive hashrate provides unmatched security</p>
            </div>

            <div className="text-xs sm:text-sm text-gray-600">
              <h4 className="font-bold">Shared Security</h4>
              <p className="text-xs sm:text-sm">Elastos inherits {securityPercentage}% of Bitcoin's security</p>
            </div>

            <div className="text-xs sm:text-sm text-gray-600">
              <h4 className="font-bold">Value Translation</h4>
              <p className="text-xs sm:text-sm">Security translates to network value</p>
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
        </div>
      </div>
    </div>
  );
};

export default ValueJustificationViz;