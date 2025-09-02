import React from 'react';
import LogoComponent from './LogoComponent';

const AIUsagePolicy = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LogoComponent className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-normal mb-1">AI Usage Policy</h1>
          <p className="text-sm text-gray-500">Last updated: April 15, 2025</p>
        </div>

        <div className="w-full mx-auto space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">At Tolerable, we harness the power of artificial intelligence to enhance brand storytelling and inspirational copywriting. This policy outlines how we use AI technology and the principles that guide our approach.</p>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">1. Our AI-Powered Tools</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Tolerable integrates AI technology to support your creative process in the following ways:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Content Analysis</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Our AI tools analyze text to identify tone, sentiment, readability, and engagement potential to help refine your messaging.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Creative Assistance</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">AI-powered suggestions help overcome writer's block and inspire new approaches to storytelling and copywriting.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Language Enhancement</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">Our tools help refine grammar, style, and clarity while preserving your unique voice and messaging.</p>
                </div>

                <div className="bg-white border-l border-gray-100 pl-4 py-3">
                  <h3 className="text-base font-normal mb-1">Audience Insights</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">AI analysis helps identify how different audiences might respond to your content, enabling targeted messaging.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">2. Human-Centered Approach</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">While we leverage AI technology, we maintain a human-centered approach to storytelling:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>AI serves as a tool to enhance human creativity, not replace it</li>
                <li>All AI-generated content undergoes human review and refinement</li>
                <li>The emotional intelligence and authentic perspective that humans bring remain central to effective storytelling</li>
                <li>We believe in augmenting human capabilities rather than automating the creative process</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">3. Our AI Ethics Principles</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Tolerable is committed to the responsible use of AI technology. Our approach is guided by these core principles:</p>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Transparency</p>
                <p className="text-sm text-gray-500 leading-relaxed">We clearly communicate when and how AI is used in our services, ensuring you always know when content has been AI-assisted.</p>
              </div>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Authenticity</p>
                <p className="text-sm text-gray-500 leading-relaxed">We use AI to amplify authentic human stories, not fabricate them. Our technology helps uncover and articulate genuine narratives.</p>
              </div>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Privacy & Security</p>
                <p className="text-sm text-gray-500 leading-relaxed">We implement robust safeguards for all data processed by our AI systems and never use your content to train our models without explicit permission.</p>
              </div>

              <div className="border-l border-gray-100 pl-4 py-2 my-4">
                <p className="text-base font-normal mb-1">Inclusivity</p>
                <p className="text-sm text-gray-500 leading-relaxed">We continuously work to identify and mitigate biases in our AI systems to ensure our tools serve diverse audiences effectively.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">4. Limitations & Best Practices</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">To get the most value from our AI-powered tools, please keep these considerations in mind:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>AI suggestions should be viewed as starting points that require human refinement</li>
                <li>Our tools work best when provided with clear context and guidance</li>
                <li>AI may not fully understand cultural nuances or specialized industry terminology</li>
                <li>AI may occasionally provide incorrect, incomplete, or misleading information</li>
                <li>Always review AI-assisted content for accuracy, appropriateness, and alignment with your brand voice</li>
                <li>Users are responsible for verifying AI-generated information before using it for critical decisions</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">5. Prohibited Uses</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Our AI tools may not be used for:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Creating misleading, deceptive, or fraudulent content</li>
                <li>Generating content that promotes discrimination, harassment, or harm</li>
                <li>Impersonating individuals or organizations without authorization</li>
                <li>Circumventing safety measures or content guidelines</li>
                <li>Any purpose that violates applicable laws or regulations</li>
              </ul>
              <p className="mt-3 text-sm text-gray-500 italic">Violation of these terms may result in restriction or termination of access to our services.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">6. AI Models & Token Usage</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">Tolerable uses multiple AI models to power different features. We are committed to transparency about which models we use and how token usage is managed:</p>

              <div className="bg-white border border-gray-50 overflow-hidden mt-4">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-normal text-gray-500">Feature</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-normal text-gray-500">AI Model</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-normal text-gray-500">Token Limits</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-normal text-gray-500">Usage Controls</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Image Analysis</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Gemini 1.5 Flash</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1,000 tokens per request</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">10 requests per day per user</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Education</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Gemini 1.5 Flash</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">4,000 token context window</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">30 requests per hour per user</td>
                    </tr>

                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Content Generation</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Gemini 1.5 Flash</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">4,000 token context window</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">50 requests per day per user</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Audio Analysis</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Gemini 1.5 Flash</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">8,000 token context window</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">50MB file size limit, 5 requests per day</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-normal text-gray-700">Video Analysis</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Gemini 1.5 Flash</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">8,000 token context window</td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">50MB file size limit, 3 requests per day</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-normal mb-1 mt-6">Token Usage Monitoring</h3>
              <p className="text-sm text-gray-500 leading-relaxed">We monitor token usage to ensure fair distribution of resources and maintain service quality:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Usage metrics are tracked on a per-user basis to prevent abuse</li>
                <li>Rate limiting is applied when usage thresholds are approached</li>
                <li>Users receive notifications when nearing their usage limits</li>
                <li>Enterprise customers can request increased limits based on their needs</li>
              </ul>

              <h3 className="text-base font-normal mb-1 mt-6">Model Selection</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Tolerable uses a single, carefully selected AI model for all features:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Gemini 1.5 Flash is used for all AI features due to its excellent balance of performance, efficiency, and multimodal capabilities</li>
                <li>This model handles text generation, image analysis, video analysis, audio processing, and code assistance</li>
                <li>Using a single model ensures consistent quality and behavior across all features</li>
                <li>Model performance is regularly monitored to ensure optimal service quality</li>
              </ul>

              <h3 className="text-base font-normal mb-1 mt-6">Cost Management</h3>
              <p className="text-sm text-gray-500 leading-relaxed">We employ several strategies to manage costs while providing high-quality AI services:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                <li>Prompt optimization to reduce token consumption</li>
                <li>Caching of common queries to minimize redundant API calls</li>
                <li>Efficient request handling to maximize the value of each API call</li>
                <li>Batch processing for efficiency when appropriate</li>
              </ul>

              <div className="bg-white border-l border-gray-100 pl-4 py-3 mt-6">
                <p className="text-base font-normal mb-1">Transparency Commitment</p>
                <p className="text-sm text-gray-500 leading-relaxed">We believe in full transparency about our AI usage. If you have questions about how we use AI models or manage token usage, please contact our team for detailed information.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-3">7. Contact Us</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 leading-relaxed">If you have questions, concerns, or feedback about our AI tools or this policy, please contact us at:</p>
              <p className="text-sm">Email: <a href="mailto:inboxaiassistant@hotmail.com" className="text-black hover:text-gray-500 transition-colors duration-200">inboxaiassistant@hotmail.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIUsagePolicy;
