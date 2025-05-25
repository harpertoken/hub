import React from 'react';
import LogoComponent from './LogoComponent';

const CompanyLegal = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LogoComponent className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-normal mb-1">Company Legal Information</h1>
          <p className="text-sm text-gray-500">Last updated: April 10, 2025</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            <h2 className="text-lg font-normal mb-3">Company Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Below are the official details of our company:</p>

              <div className="bg-white border border-gray-50 overflow-hidden mt-4">
                <table className="min-w-full divide-y divide-gray-50">
                  <tbody className="bg-white divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Company Name</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Tolerable (legal entity type to be determined)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Registration Number</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Pending registration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Address</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Address to be determined</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Email</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                        <a href="mailto:inboxaiassistant@hotmail.com" className="text-black hover:text-gray-500 transition-colors duration-200">inboxaiassistant@hotmail.com</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Website</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                        <span className="text-gray-500">Coming soon</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">Legal Notices</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Please be aware of the following legal notices:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Tolerable name and logo are pending trademark registration. All rights reserved.</li>
                <li>All content, design, graphics, and other intellectual property on this site are owned by the creators of Tolerable.</li>
                <li>Unauthorized use of any materials on this website may violate copyright, trademark, and other laws.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">Governing Law</h2>
            <div className="space-y-3">
              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Jurisdiction</p>
                <p className="text-sm text-gray-500 leading-relaxed">These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">Contact Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">For legal inquiries, please contact:</p>

              <div className="mt-3">
                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Email</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    <a href="mailto:inboxaiassistant@hotmail.com" className="text-black hover:text-gray-500 transition-colors duration-200">inboxaiassistant@hotmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLegal;