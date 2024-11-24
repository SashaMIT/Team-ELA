import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Lock, Bitcoin, TrendingUp, CheckCircle, Server, Zap, Database, LayersIcon, Scale, Award, Clock, Gem, Star, Building } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHashrateData } from '../hooks/useHashrateData';

const ReservePage = () => {
  const [activeMetric, setActiveMetric] = useState('security');
  const [animatedHashrate, setAnimatedHashrate] = useState(0);
  const { data: hashrateData } = useHashrateData();
  const bitcoinHashrate = hashrateData?.bitcoinHashrate ?? 0;
  const elastosHashrate = hashrateData?.elastosHashrate ?? 0;

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = elastosHashrate / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= elastosHashrate) {
        setAnimatedHashrate(elastosHashrate);
        clearInterval(timer);
      } else {
        setAnimatedHashrate(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [elastosHashrate]);

  const realHashrateData = [
    { year: '2018', hashrate: 22, btcHashrate: 101, percentage: "21.8%" },
    { year: '2020', hashrate: 120, btcHashrate: 250, percentage: "48%" },
    { year: '2022', hashrate: 240, btcHashrate: 450, percentage: "53.3%" },
    { year: '2024', hashrate: elastosHashrate, btcHashrate: bitcoinHashrate, percentage: `${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%` }
  ];

  const investmentHighlights = [
    {
      title: "Unmatched Security",
      description: `Secured by ${elastosHashrate.toFixed(2)} EH/s of Bitcoin's hashpower - world's largest computing network`,
      icon: Shield,
      color: "blue"
    },
    {
      title: "Fixed Supply",
      description: "Fixed cap of 28.22M tokens, reaching maximum supply by 2105 - decades of proven scarcity",
      icon: Gem,
      color: "purple"
    },
    {
      title: "Energy Efficient",
      description: "Bitcoin-grade security at a fraction of the energy cost through innovative merge-mining",
      icon: Zap,
      color: "yellow"
    },
    {
      title: "Institutional Ready",
      description: "6+ years of flawless security with mathematical proof of Bitcoin-level protection",
      icon: Building,
      color: "green"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b bg-blue-500 text-white">
          <CardTitle className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <span className="text-2xl">Elastos (ELA): Bitcoin-Secured Digital Reserve Asset</span>
            </div>
            <div className="text-sm opacity-90 mt-2">
              {elastosHashrate.toFixed(2)} EH/s Security | Fixed 28.22M Supply | {((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}% Bitcoin Security
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Key Security & Supply Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-blue-50 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                <Shield className="mx-auto text-blue-500 mb-2" />
                <div className="text-2xl font-bold">{animatedHashrate.toFixed(2)} EH/s</div>
                <div className="text-sm text-gray-600">Security Power</div>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                <Lock className="mx-auto text-purple-500 mb-2" />
                <div className="text-2xl font-bold">28.22M</div>
                <div className="text-sm text-gray-600">Maximum Supply</div>
              </div>
              
              <div className="p-6 bg-yellow-50 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                <Bitcoin className="mx-auto text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">{((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">BTC Security Power</div>
              </div>

              <div className="p-6 bg-green-50 rounded-lg text-center transform hover:scale-105 transition-all duration-300">
                <Clock className="mx-auto text-green-500 mb-2" />
                <div className="text-2xl font-bold">2105</div>
                <div className="text-sm text-gray-600">Final Supply Year</div>
              </div>
            </div>

            {/* Security Growth Visualization */}
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                <Shield className="text-blue-500" />
                Bitcoin Security Integration
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={realHashrateData}>
                    <XAxis dataKey="year" />
                    <YAxis domain={[0, Math.max(bitcoinHashrate, 700)]} />
                    <Tooltip 
                      formatter={(value, name) => [`${value} EH/s`, name === 'hashrate' ? 'Elastos Security' : 'Bitcoin Network']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="btcHashrate" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.1}
                      name="Bitcoin"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hashrate" 
                      stroke="#2563eb" 
                      fill="#2563eb"
                      fillOpacity={0.2}
                      name="Elastos"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Investment Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investmentHighlights.map((highlight, index) => (
                <div key={index} className="p-6 bg-white rounded-lg border transform hover:scale-105 transition-all duration-300">
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                    <highlight.icon className="text-blue-500" />
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className="p-6 bg-blue-500 text-white rounded-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Star />
                Premium Security & Scarcity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Security Leadership</h4>
                  <ul className="space-y-2">
                    {[
                      "Bitcoin-level security at fraction of energy cost",
                      `Highest merge-mining participation (${((elastosHashrate/bitcoinHashrate) * 100).toFixed(1)}%+)`,
                      `${elastosHashrate.toFixed(2)} EH/s of protection and growing`,
                      "6+ years of proven security"
                    ].map((point, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span className="text-sm opacity-90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Supply Certainty</h4>
                  <ul className="space-y-2">
                    {[
                      "Fixed maximum supply of 28.22M tokens",
                      "Final supply reached by 2105",
                      "Mathematically guaranteed cap",
                      "Transparent emission schedule"
                    ].map((point, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span className="text-sm opacity-90">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Premium Investment Case */}
            <div className="text-center p-8 bg-white rounded-lg border-2 border-blue-500">
              <h3 className="text-2xl font-bold mb-4">Unique Digital Reserve Asset</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Elastos combines the world's strongest security infrastructure ({elastosHashrate.toFixed(2)} EH/s) with 
                a guaranteed fixed supply (28.22M by 2105), creating a premium store of value 
                secured by Bitcoin's network while consuming only a fraction of the energy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservePage;
