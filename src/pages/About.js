import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full max-w-4xl px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#374151'}}>
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
              <path d="M12 3v6"></path>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#111827'}}>About hub</h1>
          <p className="text-lg font-medium" style={{color: '#6b7280'}}>by harpertoken</p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {/* What is hub? */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>What is hub?</h2>
            </div>
            <div className="ml-12">
              <p className="text-lg leading-relaxed" style={{color: '#4b5563'}}>
                hub is a powerful platform developed by harpertoken, designed to provide seamless integration and management of various tools and services in one centralized location.
              </p>
            </div>
          </div>

          {/* Our Mission */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Our Mission</h2>
            </div>
            <div className="ml-12">
              <p className="text-lg leading-relaxed" style={{color: '#4b5563'}}>
                To simplify complex workflows and provide intuitive interfaces for both technical and non-technical users.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#6b7280'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Key Features</h2>
            </div>
            <div className="ml-12">
              <div className="grid gap-4">
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Centralized tool management</span>
                </div>
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Intuitive user interface</span>
                </div>
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Seamless integration</span>
                </div>
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Secure platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t" style={{borderColor: '#e5e5e5'}}>
          <p className="text-sm" style={{color: '#9ca3af'}}>
            Built with ❤️ by harpertoken
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;