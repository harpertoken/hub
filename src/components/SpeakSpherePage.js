
import React from 'react';
import { Link } from 'react-router-dom';
import VoiceSearch from './VoiceSearch';

const SpeakSpherePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <div className="w-full max-w-3xl px-4 py-16 relative">
        {/* Header - Exactly matching Education component */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-3">
            <img
              src="/assets/tolerable-brand/tolerable-logo.svg"
              alt="Tolerable Logo"
              className="h-12 w-12"
            />
          </div>
          <h1 className="text-2xl font-normal mb-1">SpeakSphere</h1>
        </div>

        {/* Voice Search Component */}
        <div className="w-full max-w-2xl mx-auto pb-16">
          <VoiceSearch />

          {/* Back to Education link */}
          <div className="flex justify-center mt-8">
            <Link
              to="/education"
              className="px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200"
            >
              ← Back to Education
            </Link>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SpeakSpherePage;
