import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            About Tolerable
          </div>
          Tolerable
          <p className="text-sm" style={{color: '#666666'}}>
            Intelligence, reimagined.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          About Tolerable
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Tolerable is a modern AI-powered platform for learning and creating.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          System Architecture
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Built with React, Node.js, Gemini AI.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          Key Features
          <p className="text-sm text-gray-500 leading-relaxed">
            Education, AI Lab, Content Management, Screen Recording.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          Policy Framework
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Policies for manufacturing, government, cloud, security, justice, progress.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          Design Philosophy
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Minimalist design: clean typography, reduced noise, white interface.
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;