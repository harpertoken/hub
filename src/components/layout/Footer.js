// src/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-3 w-full z-10 mt-auto border-t border-gray-50">
      <div className="w-full mx-auto px-0">
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center gap-3 mb-1 md:mb-0 md:ml-0">
            <a href="/cookbook" className="hover:text-gray-600 transition-colors duration-200">
              Cookbook
            </a>
            <a href="/about" className="hover:text-gray-600 transition-colors duration-200">
              About
            </a>
            <a href="/settings" className="hover:text-gray-600 transition-colors duration-200">
              Settings
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              Privacy
            </a>
            <a href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              Terms
            </a>
            <a href="/ai-policy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200">
              AI Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
