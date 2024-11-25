import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Boxes, Hash, Clock, CheckCircle2, ServerCrash, ExternalLink, Copy, ChevronRight } from 'lucide-react';

const BlockVisualizer = () => {
  const [currentBlock, setCurrentBlock] = useState({
    hash: "23411800476b40efe8e8874b3fea794bf8ac6d89503d37cc8c1cd386c62a6721",
    height: 1829335,
    time: Date.now() / 1000,
    txlength: 2,
    poolInfo: { poolName: "ViaBTC" },
    hashrate: "363.2 EH/s"
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');
  const [showCopied, setShowCopied] = useState(false);

  const EXPLORER_URL = 'https://ela.elastos.io/block/';

  const truncateHash = (hash: string) => `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor(Date.now() / 1000 - currentBlock.time);
      if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentBlock.time]);

  const handleNewBlock = (newBlock: any) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentBlock(newBlock);
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newBlock = {
        hash: "4eb717511e4d882d3f1fc7266f4b328892e436fc9904a3a3938af03acf96ff4a",
        height: 1829343,
        time: Date.now() / 1000,
        txlength: 4,
        poolInfo: { poolName: "binance" },
        hashrate: "363.2 EH/s",
        previousblockhash: "251bc4d33b13f9a58bc4e5923766162a58f0508494517a7f429ab098fadd7886"
      };
      handleNewBlock(newBlock);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`w-full bg-white transform transition-all duration-500 border-blue-100
      ${isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <div className="p-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center animate-pulse shrink-0">
                <Boxes className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-2.5 h-2.5">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 flex-1">
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
              <div className="flex items-center justify-between gap-1">
                <ChevronRight className="h-3 w-3 text-blue-500" />
                <div className="text-base font-mono font-bold text-blue-500">
                  #{currentBlock.height.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-gray-50 rounded px-2 py-1 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">Block:</span>
                <a 
                  href={`${EXPLORER_URL}${currentBlock.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`View block ${currentBlock.hash} in explorer`}
                  className="text-xs font-mono text-blue-500 hover:text-blue-700 flex items-center gap-1 group"
                >
                  {truncateHash(currentBlock.hash)}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
                <button
                  onClick={() => copyToClipboard(currentBlock.hash)}
                  className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                  title="Copy hash"
                >
                  <Copy className="h-3 w-3 text-gray-500 hover:text-blue-500" />
                </button>
                {showCopied && (
                  <span className="text-xs text-green-500">Copied!</span>
                )}
              </div>
            </div>
            
            {currentBlock.previousblockhash && (
              <div className="bg-gray-50 rounded px-2 py-1 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Previous:</span>
                  <a 
                    href={`${EXPLORER_URL}${currentBlock.previousblockhash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View block ${currentBlock.previousblockhash} in explorer`}
                    className="text-xs font-mono text-blue-500 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    {truncateHash(currentBlock.previousblockhash)}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(currentBlock.previousblockhash)}
                    className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                    title="Copy hash"
                  >
                    <Copy className="h-3 w-3 text-gray-500 hover:text-blue-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlockVisualizer;
