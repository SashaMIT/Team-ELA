import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Boxes, Hash, Clock, CheckCircle2, ServerCrash, ExternalLink, Copy, ChevronRight } from 'lucide-react';

interface BlockData {
  hash: string;
  height: number;
  time: number;
  txlength: number;
  poolInfo: { poolName: string };
  hashrate: string;
  previousblockhash?: string;
}

const BlockVisualizer = () => {
  const [currentBlock, setCurrentBlock] = useState<BlockData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');
  const [showCopied, setShowCopied] = useState(false);

  const EXPLORER_URL = 'https://ela.elastos.io/block/';

  const truncateHash = (hash: string, mobile = false): string => {
    if (mobile) {
      return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
    }
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  useEffect(() => {
    if (!currentBlock) return;
    
    const updateTime = () => {
      const seconds = Math.floor(Date.now() / 1000 - currentBlock.time);
      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentBlock?.time]);

  const handleNewBlock = (newBlock: BlockData) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBlock(newBlock);
      setIsTransitioning(false);
    }, 500);
  };

  const fetchLatestBlock = async () => {
    try {
      const newBlockResponse = await fetch('https://ela.elastos.io/api/v1/newblock/');
      const newBlockData = await newBlockResponse.json();
      
      const blockResponse = await fetch(`https://ela.elastos.io/api/v1/block/${newBlockData.hash}`);
      const blockData = await blockResponse.json();
      
      handleNewBlock({
        hash: blockData.hash,
        height: blockData.height,
        time: blockData.time,
        txlength: blockData.tx.length,
        poolInfo: { poolName: blockData.poolInfo?.poolName || 'Unknown' },
        hashrate: (blockData.networkhashps / 1e18).toFixed(2) + ' EH/s',
        previousblockhash: blockData.previousblockhash
      });
    } catch (error) {
      console.error('Error fetching block data:', error);
    }
  };

  useEffect(() => {
    fetchLatestBlock(); // Immediate call
    const interval = setInterval(fetchLatestBlock, 15000);
    return () => clearInterval(interval);
  }, []);

  interface StatBoxProps {
    icon: React.ElementType;
    color: string;
    value: string | number;
  }

  const StatBox: React.FC<StatBoxProps> = ({ icon: Icon, color, value }) => (
    <div className={`bg-${color}-50 px-2 py-1 rounded flex items-center justify-between group hover:bg-${color}-100 transition-colors`}>
      <Icon className={`h-3 w-3 text-${color}-500`} />
      <span className="text-xs font-medium">{value}</span>
    </div>
  );

  if (!currentBlock) {
    return (
      <Card className="w-full p-4">
        <div className="animate-pulse text-center text-muted-foreground">
          Loading latest block...
        </div>
      </Card>
    );
  }

  return (
    <Card className={`w-full bg-white transform transition-all duration-500 border-blue-100
      ${isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <div className="p-2">
        <div className="flex flex-col gap-2">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center animate-pulse">
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2.5 h-2.5">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
            </div>

            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1">
              <div className="bg-blue-50 px-2 py-1 rounded flex items-center justify-between group hover:bg-blue-100 transition-colors">
                <Hash className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">{currentBlock.txlength} TXs</span>
              </div>
              <div className="bg-green-50 px-2 py-1 rounded flex items-center justify-between group hover:bg-green-100 transition-colors">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium">{currentBlock.poolInfo.poolName}</span>
              </div>
              <div className="bg-purple-50 px-2 py-1 rounded flex items-center justify-between group hover:bg-purple-100 transition-colors">
                <ServerCrash className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-medium">{currentBlock.hashrate}</span>
              </div>
              <div className="bg-orange-50 px-2 py-1 rounded flex items-center justify-between group hover:bg-orange-100 transition-colors">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium">{timeAgo}</span>
              </div>
              <div className="flex items-center justify-between gap-1 col-span-2 sm:col-span-1">
                <ChevronRight className="h-3 w-3 text-blue-500" />
                <div className="text-base font-mono font-bold text-blue-500">
                  #{currentBlock.height.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Hash Links - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2">
            {currentBlock.previousblockhash && (
              <div className="bg-gray-50 rounded px-2 py-1 flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Previous:</span>
                  <a 
                    href={`${EXPLORER_URL}${currentBlock.previousblockhash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View block ${currentBlock.previousblockhash} in explorer`}
                    className="text-xs font-mono text-blue-500 hover:text-blue-700 flex items-center gap-1 group truncate"
                  >
                    <span className="hidden sm:inline">{truncateHash(currentBlock.previousblockhash)}</span>
                    <span className="sm:hidden">{truncateHash(currentBlock.previousblockhash, true)}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                  <button
                    onClick={() => currentBlock?.previousblockhash && copyToClipboard(currentBlock.previousblockhash)}
                    className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity shrink-0"
                    title="Copy hash"
                  >
                    <Copy className="h-3 w-3 text-gray-500 hover:text-blue-500" />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded px-2 py-1 flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">Block:</span>
                <a 
                  href={`${EXPLORER_URL}${currentBlock.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`View block ${currentBlock.hash} in explorer`}
                  className="text-xs font-mono text-blue-500 hover:text-blue-700 flex items-center gap-1 group truncate"
                >
                  <span className="hidden sm:inline">{truncateHash(currentBlock.hash)}</span>
                  <span className="sm:hidden">{truncateHash(currentBlock.hash, true)}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
                <button
                  onClick={() => copyToClipboard(currentBlock.hash)}
                  className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity shrink-0"
                  title="Copy hash"
                >
                  <Copy className="h-3 w-3 text-gray-500 hover:text-blue-500" />
                </button>
                {showCopied && (
                  <span className="text-xs text-green-500">Copied!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlockVisualizer;