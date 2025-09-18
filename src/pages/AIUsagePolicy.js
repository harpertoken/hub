import React from 'react';

const AIUsagePolicy = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            AI Usage Policy
          </div>
          <p className="text-sm text-gray-500">Last updated: April 15, 2025</p>
        </div>

        <div className="w-full mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">AI enhances creativity without replacing human input. Use responsibly.</p>
        </div>
      </div>
    </div>
  );
};

export default AIUsagePolicy;