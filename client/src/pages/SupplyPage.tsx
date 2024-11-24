import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Table, BarChart2, Coins, Clock, Calendar, Percent, PlusSquare, Database, Heart, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ELASupplyModelDashboard = () => {
  const currentSupply = 26220000;
  const nextHalvingDate = new Date('2025-12-01');
  
  const [showData, setShowData] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [animatedSupply, setAnimatedSupply] = useState(currentSupply);

  const getHalvingProgress = () => {
    const lastHalving = new Date('2021-12-01');
    const now = new Date();
    const totalDuration = nextHalvingDate.getTime() - lastHalving.getTime();
    const elapsed = now.getTime() - lastHalving.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const marketCapComparisons = [
    { name: 'Bitcoin', cap: 880000000000, symbol: 'BTC' },
    { name: 'Ethereum', cap: 260000000000, symbol: 'ETH' },
    { name: 'Elastos', cap: currentSupply * 1.78, symbol: 'ELA' }
  ];

  const keyEvents = [
    { year: 2021, event: 'First Halving', description: 'Initial supply reduction event' },
    { year: 2025, event: 'Second Halving', description: 'Major supply reduction milestone' },
    { year: 2029, event: 'Third Halving', description: 'Further scarcity increase' }
  ];

  const supplySchedule = [
    { halvingDate: new Date('2021-12-01'), year: 2021, percentage: null, increment: null, supply: 24620000 },
    { halvingDate: new Date('2025-12-01'), year: 2025, percentage: 0.02, increment: 1600000, supply: 26620000 },
    { halvingDate: new Date('2029-12-01'), year: 2029, percentage: 0.01, increment: 800000, supply: 27420000 },
    { halvingDate: new Date('2033-12-01'), year: 2033, percentage: 0.005, increment: 400000, supply: 27820000 },
    { halvingDate: new Date('2037-12-01'), year: 2037, percentage: 0.0025, increment: 200000, supply: 28020000 },
    { halvingDate: new Date('2041-12-01'), year: 2041, percentage: 0.00125, increment: 100000, supply: 28120000 },
    { halvingDate: new Date('2045-12-01'), year: 2045, percentage: 0.000625, increment: 50000, supply: 28170000 },
    { halvingDate: new Date('2049-12-01'), year: 2049, percentage: 0.0003125, increment: 25000, supply: 28195000 },
    { halvingDate: new Date('2053-12-01'), year: 2053, percentage: 0.00015625, increment: 12500, supply: 28207500 },
    { halvingDate: new Date('2057-12-01'), year: 2057, percentage: 0.000078125, increment: 6250, supply: 28213750 },
    { halvingDate: new Date('2061-12-01'), year: 2061, percentage: 0.00390625, increment: 3125, supply: 28216875 },
    { halvingDate: new Date('2065-12-01'), year: 2065, percentage: 0.001953125, increment: 1562.5, supply: 28218437.5 },
    { halvingDate: new Date('2069-12-01'), year: 2069, percentage: 0.0009765625, increment: 781.25, supply: 28219218.75 },
    { halvingDate: new Date('2073-12-01'), year: 2073, percentage: 0.00048828125, increment: 390.625, supply: 28219609.375 },
    { halvingDate: new Date('2077-12-01'), year: 2077, percentage: 0.000244140625, increment: 195.3125, supply: 28219804.6875 },
    { halvingDate: new Date('2081-12-01'), year: 2081, percentage: 0.0001220703125, increment: 97.65625, supply: 28219902.34375 },
    { halvingDate: new Date('2085-12-01'), year: 2085, percentage: 0.00006103515625, increment: 48.828125, supply: 28219951.171875 },
    { halvingDate: new Date('2089-12-01'), year: 2089, percentage: 0.000030517578125, increment: 24.4140625, supply: 28219975.5859375 },
    { halvingDate: new Date('2093-12-01'), year: 2093, percentage: 0.0000152587890625, increment: 12.20703125, supply: 28219987.79296875 },
    { halvingDate: new Date('2097-12-01'), year: 2097, percentage: 0.00000762939453125, increment: 6.103515625, supply: 28219993.896484375 },
    { halvingDate: new Date('2101-12-01'), year: 2101, percentage: 0.000003814697265625, increment: 3.0517578125, supply: 28219996.9482421875 },
    { halvingDate: new Date('2105-12-01'), year: 2105, percentage: 0.00000191, increment: 1.52587890, supply: 28219999 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = nextHalvingDate.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [nextHalvingDate]);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = (currentSupply - animatedSupply) / steps;
    const stepDuration = duration / steps;
    
    if (animatedSupply !== currentSupply) {
      const timer = setInterval(() => {
        setAnimatedSupply(prev => {
          const next = prev + increment;
          if (Math.abs(currentSupply - next) < Math.abs(increment)) {
            clearInterval(timer);
            return currentSupply;
          }
          return next;
        });
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [currentSupply]);

  const formatYAxis = (value: number) => {
    return (value / 1000000).toFixed(1) + 'M';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = supplySchedule.find(item => item.year === label);
    if (!data) return null;

    return (
      <div className="p-4 border rounded-lg bg-white shadow-lg">
        <p className="font-bold text-blue-600">Year {label}</p>
        <p className="text-gray-600">Halving Date: {data.halvingDate.toLocaleDateString()}</p>
        <p className="text-blue-600 font-semibold">Supply: {payload[0].value.toLocaleString()} ELA</p>
        {data.percentage !== null && (
          <>
            <p className="text-teal-600">Growth Rate: {(data.percentage * 100).toFixed(10)}%</p>
            <p className="text-blue-600">New ELA: +{data.increment.toLocaleString()}</p>
          </>
        )}
      </div>
    );
  };

  const getYAxisDomain = () => {
    if (isZoomed) {
      const zoomedData = supplySchedule.filter(item => item.year >= 2045);
      const minSupply = Math.min(...zoomedData.map(item => item.supply));
      const maxSupply = Math.max(...zoomedData.map(item => item.supply));
      const padding = (maxSupply - minSupply) * 0.01;
      return [minSupply - padding, maxSupply + padding];
    }
    return [24000000, 28500000];
  };

  const filteredData = isZoomed ? supplySchedule.filter(item => item.year >= 2045) : supplySchedule;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-teal-50">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Heart size={40} className="text-blue-500" />
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              ELA Supply Journey
            </CardTitle>
          </div>
          <p className="text-center text-gray-600">Exploring our token's growth story together!</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Coins size={24} className="text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700">Current Supply</h3>
                    <p className="text-2xl text-blue-600">{currentSupply.toLocaleString()} ELA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-teal-100 to-teal-50 border-none">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock size={24} className="text-teal-600" />
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-teal-700">Next Halving</h3>
                    <p className="text-xl text-teal-600">{nextHalvingDate.toLocaleDateString()}</p>
                    <p className="text-sm text-teal-500">Time remaining: {countdown}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${getHalvingProgress()}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TooltipProvider>
              {['Circulating', 'Staked', 'Reserved'].map((type, index) => (
                <Card key={type} className="bg-white">
                  <CardContent className="pt-6">
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-24 h-24 mx-auto">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              className="text-gray-200"
                              strokeWidth="8"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="48"
                              cy="48"
                            />
                            <circle
                              className="text-blue-600 transition-all duration-1000"
                              strokeWidth="8"
                              strokeDasharray={251.2}
                              strokeDashoffset={251.2 * (1 - ([70, 20, 10][index] / 100))}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="48"
                              cy="48"
                            />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-lg font-bold"
                            >
                              {[70, 20, 10][index]}%
                            </motion.div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{type} Supply Distribution</p>
                      </TooltipContent>
                    </UITooltip>
                    <h3 className="text-center mt-4 font-semibold">{type}</h3>
                  </CardContent>
                </Card>
              ))}
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant="outline"
              onClick={() => setIsZoomed(!isZoomed)}
              className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-2"
            >
              {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              {isZoomed ? 'View Full Journey' : 'Focus on Future'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowData(!showData)}
              className="bg-white hover:bg-teal-50 text-teal-600 border-teal-200 flex items-center gap-2"
            >
              <Table size={18} />
              {showData ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>

          <div className="h-[500px] bg-white rounded-lg p-4 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  scale="linear"
                  domain={getYAxisDomain()}
                  tickFormatter={formatYAxis}
                  tickCount={10}
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="supply" 
                  stroke="#0ea5e9" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#0ea5e9' }} 
                  name="Smooth Growth"
                  animationDuration={1000}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="supply" 
                  stroke="#14b8a6" 
                  strokeWidth={2} 
                  name="Step Growth"
                  animationDuration={1000}
                />
                {keyEvents.map((event, index) => (
                  <ReferenceLine 
                    key={index}
                    x={event.year} 
                    stroke="#0284c7"
                    strokeDasharray="3 3"
                    label={{ 
                      value: event.event,
                      position: 'top',
                      fill: '#0284c7',
                      fontSize: 10
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {showData && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-teal-100">
                    <th className="p-4 text-left text-gray-700"><Calendar size={18} className="inline mr-2 text-blue-600" />Halving Date</th>
                    <th className="p-4 text-left text-gray-700"><Percent size={18} className="inline mr-2 text-teal-600" />Growth Rate</th>
                    <th className="p-4 text-left text-gray-700"><PlusSquare size={18} className="inline mr-2 text-blue-600" />New ELA</th>
                    <th className="p-4 text-left text-gray-700"><Database size={18} className="inline mr-2 text-teal-600" />Total Supply</th>
                  </tr>
                </thead>
                <tbody>
                  {supplySchedule.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="p-4 text-gray-600">{item.halvingDate.toLocaleDateString()}</td>
                      <td className="p-4 text-teal-600">{item.percentage !== null ? (item.percentage * 100).toFixed(10) + '%' : '-'}</td>
                      <td className="p-4 text-blue-600">{item.increment !== null ? '+' + item.increment.toLocaleString() : '-'}</td>
                      <td className="p-4 text-teal-600 font-semibold">{item.supply.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ELASupplyModelDashboard;
