import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
        Welcome to Blockchain Stats
      </h1>
      <p className="text-muted-foreground">
        Explore detailed statistics and visualizations about blockchain networks.
        Navigate to the Security tab to view network hashrate comparisons.
      </p>
    </div>
  );
};

export default HomePage;
