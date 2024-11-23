import React, { useState, useEffect } from 'react';
import { Server, Shield, Coins, Zap } from 'lucide-react';

interface Particle {
  id: number;
  progress: number;
}

const MergeMiningAnimation = () => {
  const [step, setStep] = useState(0);
  const [securityParticles, setSecurityParticles] = useState<Particle[]>([]);
  const [rewardParticles, setRewardParticles] = useState<Particle[]>([]);
  
  // Auto-advance steps
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Generate particles with longer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecurityParticles(prev => [
        ...prev.filter(p => p.progress < 100),
        { id: Date.now(), progress: 0 }
      ]);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRewardParticles(prev => [
        ...prev.filter(p => p.progress < 100),
        { id: Date.now(), progress: 0 }
      ]);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Much slower particle animation
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setSecurityParticles(prev => 
        prev.map(p => ({
          ...p,
          progress: p.progress + 0.1
        })).filter(p => p.progress < 100)
      );
      
      setRewardParticles(prev => 
        prev.map(p => ({
          ...p,
          progress: p.progress + 0.1
        })).filter(p => p.progress < 100)
      );
    });
    return () => cancelAnimationFrame(animationFrame);
  });

  const StepContent = () => {
    const contents = [
      {
        title: "Mine Two Chains at Once",
        description: "Bitcoin miners can secure both networks simultaneously"
      },
      {
        title: "Earn More Rewards",
        description: "Get both BTC and ELA rewards for the same work"
      },
      {
        title: "No Extra Energy",
        description: "100% efficient - no additional power needed"
      }
    ];

    return (
      <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 
                     bg-white/90 p-3 sm:p-4 rounded-xl shadow-lg text-center w-[90%] sm:w-3/4 z-20">
        <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-800">{contents[step].title}</h3>
        <p className="text-sm sm:text-base text-gray-600">{contents[step].description}</p>
      </div>
    );
  };

  const Benefits = () => {
    const benefits = [
      { 
        icon: <Shield className="w-5 h-5" />, 
        text: "Bitcoin-Level Security",
        activeColor: "bg-orange-100",
        textColor: "text-orange-600",
        iconColor: "text-orange-500"
      },
      { 
        icon: <Coins className="w-5 h-5" />, 
        text: "Double Mining Rewards",
        activeColor: "bg-blue-100",
        textColor: "text-blue-600",
        iconColor: "text-blue-500"
      },
      { 
        icon: <Zap className="w-5 h-5" />, 
        text: "Same Energy Usage",
        activeColor: "bg-green-100",
        textColor: "text-green-600",
        iconColor: "text-green-500"
      }
    ];

    return (
      <div className={`absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 
                    bg-white/90 p-2 sm:p-4 rounded-xl shadow-lg w-[90%] sm:w-3/4 z-20`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
          {benefits.map((benefit, i) => (
            <div key={i} 
                 className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-500
                            ${step === i ? benefit.activeColor + ' scale-110' : 'scale-100'}`}>
              <div className={step === i ? benefit.iconColor : 'text-gray-400'}>
                {benefit.icon}
              </div>
              <span className={`text-xs sm:text-sm font-medium ${step === i ? benefit.textColor : 'text-gray-500'}`}>
                {benefit.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl p-2 sm:p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
      <div className="relative h-[350px] xs:h-[400px] sm:h-[500px]">
        {/* Animated Particles and Labels Container */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {/* Flow Labels */}
          <div className="absolute left-1/2 transform -translate-x-1/2 
                         font-bold text-sm sm:text-lg text-orange-600/90 px-2 sm:px-4"
               style={{ top: '45%' }}>
            SECURITY
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 
                         font-bold text-lg text-blue-600/90 px-4"
               style={{ top: '60%' }}>
            REWARDS
          </div>

          <svg className="absolute inset-0 w-full h-full">
            {/* Security Flow */}
            {securityParticles.map(particle => {
              const x = 25 + (particle.progress * 0.5);
              return (
                <g key={`security-${particle.id}`} className="opacity-80">
                  <circle 
                    cx={`${x}%`} 
                    cy="40%" 
                    r="3" 
                    className="fill-orange-400"
                  >
                    <animate
                      attributeName="r"
                      values="3;4;3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
            
            {/* Rewards Flow */}
            {rewardParticles.map(particle => {
              const x = 75 - (particle.progress * 0.5);
              return (
                <g key={`reward-${particle.id}`} className="opacity-80">
                  <circle 
                    cx={`${x}%`} 
                    cy="60%" 
                    r="3" 
                    className="fill-blue-400"
                  >
                    <animate
                      attributeName="r"
                      values="3;4;3"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bitcoin Mining Side */}
        <div className="absolute left-2 sm:left-8 top-[30%] sm:top-1/2 transform -translate-y-1/2 z-10">
          <div className="p-2 sm:p-4 md:p-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border-2 border-orange-400 shadow-lg">
            <div className="flex items-center gap-1 sm:gap-3 mb-1 sm:mb-4">
              <Server className="text-orange-600 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              <div>
                <span className="font-bold text-xs sm:text-sm md:text-xl block">Bitcoin</span>
                <span className="text-xs sm:text-sm text-orange-600">Miners</span>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 text-sm mt-4 p-2 rounded-lg
                          ${step === 1 ? 'bg-orange-200/50' : ''}`}>
              <Coins className="w-5 h-5 text-orange-600" />
              <span>BTC Rewards</span>
            </div>
          </div>
        </div>

        {/* Elastos Side */}
        <div className="absolute right-2 sm:right-8 top-[70%] sm:top-1/2 transform -translate-y-1/2 z-10">
          <div className="p-2 sm:p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border-2 border-blue-400 shadow-lg">
            <div className="flex items-center gap-1 sm:gap-3 mb-1 sm:mb-4">
              <Shield className="text-blue-600 w-4 h-4 sm:w-8 sm:h-8" />
              <div>
                <span className="font-bold text-sm sm:text-xl block">Elastos</span>
                <span className="text-xs sm:text-sm text-blue-600">Merge Mining</span>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 text-sm mt-4 p-2 rounded-lg
                          ${step === 1 ? 'bg-blue-200/50' : ''}`}>
              <Coins className="w-5 h-5 text-blue-600" />
              <span>ELA Rewards</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <StepContent />
        <Benefits />
      </div>

      {/* Progress Indicators */}
      <div className="mt-4 flex justify-center gap-3">
        {[0,1,2].map(i => (
          <div 
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300
                      ${step === i ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MergeMiningAnimation;
