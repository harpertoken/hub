import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            Privacy Policy
          </div>
          <p className="text-sm text-gray-500">Last updated: April 10, 2025</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">We value your privacy.</p>
          </div>

          <div>
            1. Information We Collect
            <p className="text-sm text-gray-500 leading-relaxed">Account info, content, usage data, technical info.</p>
          </div>

          <div>
            2. How We Use Your Information
            <p className="text-sm text-gray-500 leading-relaxed">To provide services, personalize, communicate, analyze, secure, comply.</p>
          </div>

          <div>
            3. Data Security
            <p className="text-sm text-gray-500 leading-relaxed">Encryption, testing, controls, monitoring.</p>
          </div>

          <div>
            4. Your Privacy Rights
            <p className="text-sm text-gray-500 leading-relaxed">Access, correct, delete, restrict, portability, withdraw consent.</p>
          </div>

          <div>
            5. Contact Us

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;