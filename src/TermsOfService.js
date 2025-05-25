import React from 'react';
import LogoComponent from './components/LogoComponent';

const TermsOfService = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LogoComponent className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-normal mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: April 10, 2025</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            <h2 className="text-lg font-normal mb-3">1. Acceptance of Terms</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">By accessing or using Tolerable services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">2. Use License</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">We grant you a limited, non-exclusive, non-transferable license to use our services for personal or business purposes in accordance with these Terms.</p>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">License Restrictions</p>
                <p className="text-sm text-gray-500 leading-relaxed">This license does not permit you to:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                  <li>Modify, copy, or create derivative works based on our services or content</li>
                  <li>Use any data mining, robots, or similar data gathering methods</li>
                  <li>Remove any copyright or other proprietary notices</li>
                  <li>Transfer the materials to another person or mirror them on any other server</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">Your license shall automatically terminate if you violate any of these restrictions.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">3. Your Content</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">When you create, upload, or share content through our services, you retain ownership of your intellectual property rights.</p>
              <p className="text-sm text-gray-500 leading-relaxed">By submitting content, you grant Tolerable a worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and distribute that content for the purpose of providing and improving our services.</p>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Your Representations</p>
                <p className="text-sm text-gray-500 leading-relaxed">You represent and warrant that:</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                  <li>You own or have the necessary rights to the content you submit</li>
                  <li>Your content does not violate the privacy rights, publicity rights, copyright, or other rights of any person</li>
                  <li>Your content does not contain any material that could be considered harmful, offensive, or unlawful</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">4. Limitation of Liability</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">To the fullest extent permitted by law, Tolerable shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Loss of profits, data, or use</li>
                <li>Business interruption</li>
                <li>Cost of substitute services</li>
              </ul>
              <p className="text-sm text-gray-500 leading-relaxed mt-3">This limitation applies regardless of the theory of liability and even if we have been advised of the possibility of such damages.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">5. Changes to Terms</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">We reserve the right to modify these Terms at any time. We will provide notice of significant changes by:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Website Notice</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Posting a notice on our website to inform all users of the changes.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Email Notification</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Sending an email to registered users with details about the changes.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Date Update</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Updating the "Last updated" date at the top of these Terms.</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">Your continued use of our services after such modifications constitutes your acceptance of the revised Terms.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">6. Contact Us</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">If you have any questions about these Terms, please contact us at:</p>
              <p className="text-sm">Email: <a href="mailto:inboxaiassistant@hotmail.com" className="text-black hover:text-gray-500 transition-colors duration-200">inboxaiassistant@hotmail.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
