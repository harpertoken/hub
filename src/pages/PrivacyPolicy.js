import React from 'react';
import LogoComponent from './LogoComponent';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LogoComponent className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-normal mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: April 10, 2025</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">At Tolerable, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.</p>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">1. Information We Collect</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">We collect the following types of information to provide and improve our services:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Account Information</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">When you register for our services, we collect your name, email address, and password to create and manage your account.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Content You Provide</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">We store and process content you create, upload, or share through our services, including text, images, videos, and audio files.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Usage Information</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">We collect data about how you interact with our platform, including the features you use, the time spent on our services, and your interactions with other users or content.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Technical Information</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">We automatically collect certain technical information when you use our services, including your IP address, browser type, operating system, device information, and log data.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">2. How We Use Your Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">We use your information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>To provide, maintain, and improve our services</li>
                <li>To personalize your experience and deliver content relevant to your interests</li>
                <li>To communicate with you about updates, features, and support</li>
                <li>To analyze usage patterns and optimize our platform</li>
                <li>To detect, prevent, and address technical issues and security concerns</li>
                <li>To comply with legal obligations and enforce our terms</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">3. Data Security</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">We implement industry-standard security measures to protect your personal information, including:</p>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Encryption</p>
                <p className="text-sm text-gray-500 leading-relaxed">We use encryption for sensitive data both in transit and at rest to prevent unauthorized access.</p>
              </div>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Security Testing</p>
                <p className="text-sm text-gray-500 leading-relaxed">We conduct regular security assessments and testing to identify and address potential vulnerabilities.</p>
              </div>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Access Controls</p>
                <p className="text-sm text-gray-500 leading-relaxed">We implement strict access controls and authentication procedures to limit data access to authorized personnel only.</p>
              </div>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Monitoring</p>
                <p className="text-sm text-gray-500 leading-relaxed">We continuously monitor our systems for suspicious activities and potential security threats.</p>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">4. Your Privacy Rights</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Access and review the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information in certain circumstances</li>
                <li>Restrict or object to certain processing activities</li>
                <li>Data portability (receiving your data in a structured, commonly used format)</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-sm text-gray-500 leading-relaxed mt-3">To exercise these rights, please contact us using the information provided below.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">5. Contact Us</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
              <p className="text-sm">Email: <a href="mailto:inboxaiassistant@hotmail.com" className="text-black hover:text-gray-500 transition-colors duration-200">inboxaiassistant@hotmail.com</a></p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">We will respond to your inquiry as soon as possible and within the timeframe required by applicable law.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
