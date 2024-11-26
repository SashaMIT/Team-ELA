import React, { useState, useEffect } from 'react';
import { Server, Shield, Coins, Zap, Globe, Lock, GitMerge, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MiningAnimation from './MiningAnimation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Particle {
  id: number;
  progress: number;
}

const MergeMiningAnimation = () => {
  const [step, setStep] = useState(0);
  const [securityParticles, setSecurityParticles] = useState<Particle[]>([]);
  const [rewardParticles, setRewardParticles] = useState<Particle[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecurityParticles((prev) => [
        ...prev.filter((p) => p.progress < 100),
        { id: Date.now(), progress: 0 },
      ]);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRewardParticles((prev) => [
        ...prev.filter((p) => p.progress < 100),
        { id: Date.now(), progress: 0 },
      ]);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setSecurityParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            progress: p.progress + 0.1,
          }))
          .filter((p) => p.progress < 100)
      );

      setRewardParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            progress: p.progress + 0.1,
          }))
          .filter((p) => p.progress < 100)
      );
    });
    return () => cancelAnimationFrame(animationFrame);
  });

  const Benefits = () => {
    const benefits = [
      {
        icon: <Shield className="w-5 h-5" />,
        text: "Bitcoin-Level Security",
        activeColor: "bg-orange-100",
        textColor: "text-orange-600",
        iconColor: "text-orange-500",
      },
      {
        icon: <Coins className="w-5 h-5" />,
        text: "Double Mining Rewards",
        activeColor: "bg-blue-100",
        textColor: "text-blue-600",
        iconColor: "text-blue-500",
      },
      {
        icon: <Zap className="w-5 h-5" />,
        text: "Same Energy Usage",
        activeColor: "bg-green-100",
        textColor: "text-green-600",
        iconColor: "text-green-500",
      },
    ];

    return (
      <div className="absolute bottom-1 sm:bottom-4 left-1/2 transform -translate-x-1/2 
                    bg-white/90 p-2 sm:p-4 rounded-xl shadow-lg w-[90%] sm:w-3/4
                    flex flex-col sm:flex-row justify-around gap-1 sm:gap-4 z-1">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 p-1 mb-1 sm:mb-0 rounded-lg transition-all duration-500
                        ${step === i ? benefit.activeColor + " scale-110" : "scale-100"}`}
          >
            <div className={step === i ? benefit.iconColor : "text-gray-400"}>
              {benefit.icon}
            </div>
            <span className={`text-xs sm:text-sm font-medium ${
              step === i ? benefit.textColor : "text-gray-500"
            }`}>
              {benefit.text}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl p-1 sm:p-2 md:p-0 bg-gradient-to-br from-slate-0 to-slate-00 rounded-xl">
      <h1 className="text-center text-base sm:text-lg md:text-2xl font-bold mt-0 mb-0 flex items-center justify-center gap-1 sm:gap-2 px-2 leading-snug">
        <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500 shrink-0" />
        ELA: The Bitcoin-Secured Reserve Asset
      </h1>

      <p className="text-center text-sm sm:text-base mt-[10px] mb-0 relative z-50">
        By leveraging Bitcoin's unmatched hash rate, Elastos' ELA fulfills{' '}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <span 
              role="button"
              className="text-blue-500 hover:text-blue-600 underline font-medium relative z-50 cursor-pointer"
            >
              Satoshi Nakamoto's vision
            </span>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Satoshi Nakamoto's Vision of Merged Mining</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                In his 2010 Bitcoin forum posts, Satoshi Nakamoto envisioned merged mining to enable networks like BitDNS to share Bitcoin's hash rate. This approach strengthened smaller networks, avoided computational fragmentation, and rewarded miners for securing multiple chains simultaneously, advancing innovation while maintaining decentralization. Bitcoin, as a secure backbone, becomes a foundation for a unified and efficient blockchain ecosystem.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a href="http://bitcointalk.org/index.php?topic=1790.msg28696#msg28696" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  BitcoinForum Post 1 →
                </a>
                <a href="http://bitcointalk.org/index.php?topic=1790.msg28715#msg28715" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  Bitcoin Forum Post 2 →
                </a>
              </div>
              <div className="mt-6 border-t pt-6">
                <MiningAnimation />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {' '}of advancing decentralized innovation on the most secure foundation ever created. BTC King. ELA Queen.
      </p>

      <div className="relative h-[400px] sm:h-[400px] mt-[-90px] z-0">
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <div className="absolute left-1/2 transform -translate-x-1/2 
                      font-bold text-[10px] sm:text-xs md:text-[15px] text-orange-600/90 px-2 sm:px-4
                      bg-white/80 rounded py-0.5 sm:py-1"
            style={{ top: "42%" }}>
            SECURITY
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 
                      font-bold text-[10px] sm:text-xs md:text-[15px] text-blue-600/90 px-2 sm:px-4
                      bg-white/80 rounded py-0.5 sm:py-1"
            style={{ top: "62%" }}>
            REWARDS
          </div>

          <svg className="absolute inset-0 w-full h-full">
            {securityParticles.map((particle) => {
              const x = 25 + particle.progress * 0.5;
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

            {rewardParticles.map((particle) => {
              const x = 75 - particle.progress * 0.5;
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

        <div className="absolute left-1 sm:left-8 top-1/2 transform -translate-y-1/2 z-10">
          <div className="p-2 sm:p-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border-2 border-orange-400 shadow-lg">
            <div className="flex items-center gap-1 sm:gap-3 mb-1 sm:mb-4">
              <Server className="text-orange-600 w-4 h-4 sm:w-8 sm:h-8" />
              <div>
                <span className="font-bold text-sm sm:text-xl block">Bitcoin</span>
                <span className="text-xs sm:text-sm text-orange-600">Miners</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mt-4 p-2 rounded-lg">
              <Coins className="w-5 h-5 text-orange-600" />
              <span>BTC Rewards</span>
            </div>
          </div>
        </div>

        <div className="absolute right-1 sm:right-8 top-1/2 transform -translate-y-1/2 z-10">
          <div className="p-2 sm:p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border-2 border-blue-400 shadow-lg">
            <div className="flex items-center gap-1 sm:gap-3 mb-1 sm:mb-4">
              <Shield className="text-blue-600 w-4 h-4 sm:w-8 sm:h-8" />
              <div>
                <span className="font-bold text-sm sm:text-xl block">Elastos</span>
                <span className="text-xs sm:text-sm text-blue-600">Merge Mining</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm mt-4 p-2 rounded-lg">
              <Coins className="w-5 h-5 text-blue-600" />
              <span>ELA Rewards</span>
            </div>
          </div>
        </div>

        <Benefits />
      </div>
    </div>
  );
};

export default MergeMiningAnimation;