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

        <div className="w-full mx-auto space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">We use AI to enhance storytelling and copywriting.</p>
          </div>

          <div>
            1. Our AI-Powered Tools
            <p className="text-sm text-gray-500 leading-relaxed">Content analysis, creative assistance, language enhancement, audience insights.</p>
          </div>

          <div>
            2. Human-Centered Approach
            <p className="text-sm text-gray-500 leading-relaxed">AI enhances creativity, not replaces it.</p>
          </div>

          <div>
            3. Our AI Ethics Principles
            <p className="text-sm text-gray-500 leading-relaxed">Transparency, authenticity, privacy, inclusivity.</p>
          </div>

          <div>
            4. Limitations & Best Practices
            <p className="text-sm text-gray-500 leading-relaxed">AI suggestions are starting points, review for accuracy.</p>
          </div>

          <div>
            5. Prohibited Uses
            <p className="text-sm text-gray-500 leading-relaxed">No misleading, harmful, or unlawful content.</p>
          </div>

          <div>
            6. AI Models & Token Usage
            <p className="text-sm text-gray-500 leading-relaxed">Uses Gemini 1.5 Flash with usage limits.</p>
          </div>

           <div>
             7. Contact Us
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIUsagePolicy;