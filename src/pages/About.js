import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              About harper
            </div>
            harper

        </div>

          <div className="w-full max-w-2xl mx-auto">
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              summarize in tokens
            </p>
          </div>



        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last updated: 18 Sep 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;