import React from 'react';

const UserInterface = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: '#ffffff', color: '#000000'}}>
      <div className="w-full max-w-4xl px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#374151'}}>
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color: '#111827'}}>User Interface</h1>
          <p className="text-lg font-medium" style={{color: '#6b7280'}}>Design principles and interface patterns</p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {/* Design Philosophy */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Design Philosophy</h2>
            </div>
            <div className="ml-12">
              <p className="text-lg leading-relaxed" style={{color: '#4b5563'}}>
                Our interface design follows modern principles of simplicity, accessibility, and user-centered design. We prioritize clean aesthetics, intuitive interactions, and consistent visual language throughout the platform.
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-3.76l-4.24 4.24M7.76 16.24l-4.24 4.24m12.48-12.48L7.76 7.76M16.24 16.24l-4.24-4.24"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Color Palette</h2>
            </div>
            <div className="ml-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#ffffff', border: '2px solid #e5e5e5'}}></div>
                  <p className="text-sm font-medium" style={{color: '#374151'}}>Pure White</p>
                  <p className="text-xs" style={{color: '#6b7280'}}>#FFFFFF</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#f8fafc'}}></div>
                  <p className="text-sm font-medium" style={{color: '#374151'}}>Light Gray</p>
                  <p className="text-xs" style={{color: '#6b7280'}}>#F8FAFC</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#374151'}}></div>
                  <p className="text-sm font-medium" style={{color: '#374151'}}>Dark Gray</p>
                  <p className="text-xs" style={{color: '#6b7280'}}>#374151</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-lg mx-auto mb-2" style={{backgroundColor: '#111827'}}></div>
                  <p className="text-sm font-medium" style={{color: '#374151'}}>Charcoal</p>
                  <p className="text-xs" style={{color: '#6b7280'}}>#111827</p>
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <path d="M4 7V4h16v3M4 7v13h16V7M4 7l8 6 8-6"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Typography</h2>
            </div>
            <div className="ml-12">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2" style={{color: '#111827'}}>Heading 1 - Bold Display</h1>
                  <p className="text-sm" style={{color: '#6b7280'}}>Used for main page titles and major sections</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2" style={{color: '#111827'}}>Heading 2 - Section Headers</h2>
                  <p className="text-sm" style={{color: '#6b7280'}}>Used for section titles and important subsections</p>
                </div>
                <div>
                  <p className="text-lg leading-relaxed mb-2" style={{color: '#4b5563'}}>Body Text - Primary content and descriptions</p>
                  <p className="text-sm" style={{color: '#6b7280'}}>Used for main content, descriptions, and detailed information</p>
                </div>
                <div>
                  <p className="text-sm mb-2" style={{color: '#6b7280'}}>Small Text - Secondary information and metadata</p>
                  <p className="text-xs" style={{color: '#9ca3af'}}>Used for captions, timestamps, and supplementary details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Components */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Components</h2>
            </div>
            <div className="ml-12">
              <div className="grid gap-4">
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Interactive Cards</span>
                </div>
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Navigation Elements</span>
                </div>
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Form Controls</span>
                </div>
                <div className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]" style={{backgroundColor: '#f8fafc', border: '1px solid #e5e5e5'}}>
                  <div className="w-2 h-2 rounded-full mr-4" style={{backgroundColor: '#6b7280'}}></div>
                  <span className="text-lg font-medium" style={{color: '#374151'}}>Feedback Systems</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="group">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg mr-4 flex items-center justify-center" style={{backgroundColor: '#374151'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ffffff'}}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold" style={{color: '#111827'}}>Accessibility</h2>
            </div>
            <div className="ml-12">
              <p className="text-lg leading-relaxed" style={{color: '#4b5563'}}>
                We ensure our interface is accessible to all users through proper ARIA labels, keyboard navigation, high contrast ratios, and responsive design that works across all devices and screen sizes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t" style={{borderColor: '#e5e5e5'}}>
          <p className="text-sm" style={{color: '#9ca3af'}}>
            Designed with ❤️ for optimal user experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;