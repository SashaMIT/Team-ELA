import React from 'react';
import NetworkSphere from '../components/NetworkSphere';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-[600px] w-full flex flex-col items-center space-y-8">
        <NetworkSphere />
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Welcome to the Elastos SmartWeb
          </h1>
          <p className="text-lg text-muted-foreground max-w-[500px]">
            Experience the future of decentralized computing with secure, scalable blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
