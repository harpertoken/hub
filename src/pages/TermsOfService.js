import React from 'react';

const TermsOfService = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            Terms of Service
          </div>
          <p className="text-sm text-gray-500">Last updated: April 10, 2025</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            1. Acceptance of Terms
            <p className="text-sm text-gray-500 leading-relaxed">Agree to terms by using services.</p>
          </div>

          <div>
            2. Use License
            <p className="text-sm text-gray-500 leading-relaxed">Limited license for personal/business use.</p>
          </div>

          <div>
            3. Your Content
            <p className="text-sm text-gray-500 leading-relaxed">Retain ownership, grant us license.</p>
          </div>

          <div>
            4. Limitation of Liability
            <p className="text-sm text-gray-500 leading-relaxed">No liability for indirect damages.</p>
          </div>

          <div>
            5. Changes to Terms
            <p className="text-sm text-gray-500 leading-relaxed">We may modify terms, continued use means acceptance.</p>
          </div>

          <div>
            6. Contact Us

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;