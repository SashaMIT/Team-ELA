import React from 'react';
import NetworkSphere from '../components/NetworkSphere';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-[300px] w-full flex flex-col items-center space-y-8">
        <NetworkSphere />
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Welcome to the Elastos SmartWeb
          </h1>
          <p className="text-lg text-muted-foreground max-w-[500px]">
            Elastos (ELA) is a secure, decentralized, user-owned internet powered by Bitcoin's hash rate, fulfilling Satoshi Nakamoto's 2010 vision of harnessing miner computing power for innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
