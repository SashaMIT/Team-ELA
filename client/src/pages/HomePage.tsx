import React from 'react';
import NetworkSphere from '../components/NetworkSphere';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-[800px] w-full flex flex-col items-center space-y-6 px-4">
        <div className="max-w-[300px] w-full">
          <NetworkSphere />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to the Elastos SmartWeb
          </h1>
          <p className="text-lg text-muted-foreground max-w-[700px]">
            Elastos (ELA) empowers users with ownership and control of their digital identity and data by leveraging Bitcoin's hash rate and decentralized architecture to build a secure, trustless, user-owned internet, fulfilling Satoshi Nakamoto's 2010 vision of harnessing miner computing power for innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
