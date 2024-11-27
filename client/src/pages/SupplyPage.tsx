import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Lock, Coins, Clock, Calendar, Database, Heart, TrendingUp, ChevronRight, Table, Focus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const ELASupplyPage = () => {
  const currentSupply = 25748861;
  const nextHalvingDate = new Date('2025-12-01');

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

  const [showData, setShowData] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [yAxisDomain, setYAxisDomain] = useState<[number, number]>([24000000, 28500000]);
  const [zoomLevel, setZoomLevel] = useState([0]);
  const [filteredData, setFilteredData] = useState(supplySchedule);
  
  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value);
    const zoomFactor = value[0] / 100;
    const maxYear = 2105;
    const minYear = 2021;
    const yearRange = maxYear - minYear;
    
    // Calculate the selected year based on zoom factor
    const selectedYear = Math.floor(minYear + (yearRange * (zoomFactor)));
    
    // Find the supply data for selected year
    const selectedData = supplySchedule.find(item => item.year >= selectedYear);
    
    if (!selectedData) return;
    
    // Calculate Y-axis range
    const currentSupplyValue = selectedData.supply;
    const maxSupplyValue = 28220000; // Max supply with buffer
    const remainingRange = maxSupplyValue - currentSupplyValue;
    
    // Set domains
    if (zoomFactor === 0) {
      setYAxisDomain([24000000, 28500000]);
      setFilteredData(supplySchedule);
    } else {
      const buffer = remainingRange * 0.1; // 10% buffer for visibility
      setYAxisDomain([
        currentSupplyValue - buffer,
        maxSupplyValue + buffer
      ]);
      // Update chart data filtering to show only future years
      setFilteredData(supplySchedule.filter(item => item.year >= selectedYear));
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = nextHalvingDate.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getHalvingProgress = () => {
    const lastHalving = new Date('2021-12-01');
    const now = new Date();
    const totalDuration = nextHalvingDate.getTime() - lastHalving.getTime();
    const elapsed = now.getTime() - lastHalving.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const formatYAxis = (value: number) => {
    return (value / 1000000).toFixed(1) + 'M';
  };

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
    }>;
    label?: string;
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const data = supplySchedule.find(item => item.year === Number(label));
    if (!data) return null;

    return (
      <div className="p-3 border rounded-lg bg-white shadow-lg">
        <p className="font-bold text-gray-800">Year {label}</p>
        <p className="text-gray-600 text-sm">Supply: {Number(payload[0].value).toLocaleString()} ELA</p>
        {data.percentage !== null && (
          <>
            <p className="text-gray-600 text-sm">Growth: {(data.percentage * 100).toFixed(8)}%</p>
            <p className="text-gray-600 text-sm">+{data.increment.toLocaleString()} ELA</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white p-2 sm:p-4">
      <Card className="w-full max-w-[95vw] sm:max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="p-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="flex flex-col">
              <span>ELA Supply Journey</span>
              <span className="text-sm font-normal text-muted-foreground">
                Exploring ELAs story together
              </span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current Supply & Next Halving */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2 sm:px-0">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Coins className="text-blue-500 h-5 w-5" />
                <div>
                  <div className="text-sm text-gray-600">Current Supply</div>
                  <div className="font-bold text-lg">{currentSupply.toLocaleString()} ELA</div>
                  <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="text-green-500 h-5 w-5" />
                <div>
                  <div className="text-sm text-gray-600">Total Supply</div>
                  <div className="font-bold text-lg">28,199,999 ELA</div>
                  <div className="text-xs text-gray-500">by 2105</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-500 h-5 w-5" />
                <div className="w-full">
                  <div className="text-sm text-gray-600">Next Halving</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{nextHalvingDate.toLocaleDateString()}</span>
                    <span className="text-sm text-purple-600">({countdown})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-purple-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${getHalvingProgress()}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-600 min-w-[3rem]">
                      {getHalvingProgress().toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/50 p-3 sm:p-4 rounded-lg space-y-2 mx-2 sm:mx-0">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
              <span>Progress to Total Supply</span>
              <span>{((currentSupply / 28199999) * 100).toFixed(2)}%</span>
            </div>
            <div className="w-full bg-accent/20 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(currentSupply / 28199999) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{currentSupply.toLocaleString()} ELA</span>
              <span>28,199,999 ELA</span>
            </div>
          </div>

          {/* Supply Chart */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                Supply Growth
              </h3>
              <div className="flex items-center w-full sm:w-auto gap-4">
                <div className="flex items-center gap-4 flex-1 sm:w-64">
                  <Focus className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <Slider
                      value={zoomLevel}
                      onValueChange={handleZoomChange}
                      max={100}
                      step={1}
                      className="w-full touch-pan-x touch-none select-none relative [--slider-thumb-size:32px] [--slider-track-height:12px] hover:cursor-grab active:cursor-grabbing"
                      aria-label="Chart zoom level"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={zoomLevel[0]}
                      role="slider"
                      data-touch-action="none"
                      style={{
                        // Use CSS custom properties in a type-safe way
                        ['--thumb-shadow' as string]: '0 2px 4px rgba(0,0,0,0.1)',
                        ['--thumb-hover-shadow' as string]: '0 4px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowData(!showData)}
                  className="text-xs flex items-center gap-2 whitespace-nowrap"
                >
                  <Table className="h-4 w-4 text-green-500" />
                  {showData ? 'Hide Details' : 'Show Details'}
                </Button>
              </div>
            </div>
            <div style={{ width: '100%', height: 300 }} className="sm:h-[400px] touch-pan-y touch-action-pan-y select-none transition-transform duration-300 ease-in-out">
              <ResponsiveContainer>
                <LineChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid 
                    strokeDasharray="2 4" 
                    stroke="#94a3b8" 
                    strokeOpacity={0.3}
                    horizontal={true}
                    vertical={true}
                  />
                  <XAxis 
                    dataKey="year"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => value.toString()}
                  />
                  <YAxis 
                    domain={yAxisDomain}
                    tickFormatter={formatYAxis}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    name="Smooth Growth"
                    type="monotone"
                    dataKey="supply"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: '#0ea5e9', r: 4 }}
                    isAnimationActive={true}
                    animationDuration={2000}
                  />
                  <Line
                    name="Step Growth"
                    type="stepAfter"
                    dataKey="supply"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Supply Schedule Dialog */}
          <Dialog open={showData} onOpenChange={setShowData}>
            <DialogContent className="max-w-[95vw] w-full sm:max-w-4xl mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Supply Schedule Details</DialogTitle>
              </DialogHeader>
              <div className="overflow-x-auto max-h-[60vh] -mx-4 sm:mx-0">
                <table className="w-full text-sm table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left font-medium text-gray-600">Date</th>
                      <th className="p-2 text-left font-medium text-gray-600">Growth</th>
                      <th className="p-2 text-left font-medium text-gray-600">New ELA</th>
                      <th className="p-2 text-left font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplySchedule.map((item, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-2">{item.halvingDate.toLocaleDateString()}</td>
                        <td className="p-2">{item.percentage !== null ? `${(item.percentage * 100).toFixed(8)}%` : '-'}</td>
                        <td className="p-2">{item.increment !== null ? `+${item.increment.toLocaleString()}` : '-'}</td>
                        <td className="p-2">{item.supply.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ELASupplyPage;
