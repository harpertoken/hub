import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            About hub
          </div>
          <p className="text-sm text-gray-500">by harpertoken</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            What is hub?
            <p className="text-sm text-gray-500 leading-relaxed">
              hub is a powerful platform developed by harpertoken, designed to provide seamless integration and management of various tools and services in one centralized location.
            </p>
          </div>

          <div>
            Our Mission
            <p className="text-sm text-gray-500 leading-relaxed">
              To simplify complex workflows and provide intuitive interfaces for both technical and non-technical users.
            </p>
          </div>

          <div>
            Key Features
            <p className="text-sm text-gray-500 leading-relaxed">
              Centralized tool management, intuitive user interface, seamless integration, and secure platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;