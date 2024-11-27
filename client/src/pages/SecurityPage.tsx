import React from 'react';
import HashrateVisualizer from '../components/HashrateVisualizer';
import { Shield } from 'lucide-react';

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 px-2">
          <Shield className="w-6 h-6 text-green-500" />
          Network Security Analysis
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bitcoin Network Container */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 shadow-lg">
            <HashrateVisualizer network="bitcoin" />
          </div>
          
          {/* Elastos Network Container */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 shadow-lg">
            <HashrateVisualizer network="elastos" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
