import React from 'react';
import LogoComponent from './LogoComponent';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LogoComponent className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-normal mb-1" style={{color: 'var(--text-primary)'}}>Tolerable</h1>
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
            Intelligence, reimagined.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-normal mb-3">About Tolerable</h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Tolerable is a modern AI-powered platform designed to help users explore, learn, and create through
            intuitive interfaces and powerful AI capabilities. Our minimalist design philosophy emphasizes clarity,
            simplicity, and focus on content.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-normal mb-3">System Architecture</h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Tolerable is built on a modern technology stack that combines React for the frontend with a Node.js
            backend. The system integrates with Google's Gemini 1.5 Flash model to provide advanced AI capabilities
            across all features.
          </p>

          <div className="bg-white border-l border-gray-100 pl-4 text-sm text-gray-500 mb-4">
            <h3 className="font-normal mb-2">Core Components:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-gray-700">Frontend:</span> React, TailwindCSS</li>
              <li><span className="text-gray-700">Backend:</span> Node.js, Express</li>
              <li><span className="text-gray-700">AI Services:</span> Google Gemini 1.5 Flash</li>
              <li><span className="text-gray-700">Media Processing:</span> FFmpeg for video conversion</li>
              <li><span className="text-gray-700">Storage:</span> Cloudinary for media assets</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-normal mb-3">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-normal mb-2">Education</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our Education component provides AI-powered learning experiences with voice search capabilities,
                screen recording functionality, and shareable content. It uses Gemini 1.5 Flash to generate
                educational responses to user queries.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-2">AI Lab</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                The AI Lab offers advanced tools for media analysis and content generation.
                It leverages Gemini's multimodal capabilities to process and analyze various types of content,
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-2">Content Management</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our platform includes a sophisticated content management system that allows for creating,
                editing, and organizing posts with rich media support.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-2">Screen Recording</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                The integrated screen recording feature allows users to capture and share educational content
                with options for MP4 conversion and direct social media sharing.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-normal mb-3">Policy Framework</h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Our policies are designed to drive meaningful impact across various sectors:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-base font-normal mb-1">Manufacturing Transformation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                It's not just numbers—it's impact. From a single percent to a global scale, manufacturing transforms with clarity and purpose.
                Policies drive progress, empowering manufacturers to deliver what's useful, sustainable, and real.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                Support what counts. Advocate for crystal-clear policies that fuel innovation and build a stronger future, one manufacturer at a time.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Government Transformation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                It's more than administration. It's impact. With large language models, we're not just fixing systems—we're reimagining how
                government works. Every policy, every process, every interaction becomes smarter, faster, and more human.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                From streamlining services to solving complex challenges, AI empowers administrations to deliver real change.
                It's precision meeting purpose. Innovate. Optimize. Serve.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Cloud Innovation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Effortless. Efficient. Transformative. The cloud tech stack redefines what's possible. It's not just about scaling—it's about
                streamlining. Detection, optimization, and innovation converge seamlessly, shrinking complexity and amplifying impact.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                Build smarter. Work lighter. With this shift, the future of cloud isn't just powerful—it's yours to shape.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Security Applications</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Secure. Informed. Purposeful. Behind every application is a mission: to protect national security, deliver critical news,
                and shape policies that endure. We investigate discreetly, ensuring every tool functions flawlessly to support lawful
                immigration and strengthen citizenship pathways.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                With relentless focus, we work swiftly—days, not weeks—to build solutions that uphold the law and serve the nation.
                Create. Verify. Protect.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Justice Systems</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                It's more than enforcement. It's clarity in action. Every case, every decision, every law shapes a system that upholds fairness.
                With radical software, administration becomes a force for precision—prioritizing issues, issuing condemnations, and setting
                the course for resolution.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                Streamline. Decide. Act. From complex cases to clear outcomes, build a future where law serves with unwavering purpose.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Progress & Efficiency</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                It's not just about cutting costs. It's about creating value. Streamline medical research. Deliver smarter defense budgets.
                Embrace cost-plus contracts that drive efficiency. Every step forward is a commitment to doing more with less—responsibly, purposefully.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-2">
                We don't just chase savings. We build systems that empower everyone. It's our duty to innovate, to share, to uplift.
                Join us in reshaping what's possible, one bold idea at a time.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-normal mb-3">Design Philosophy</h2>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Tolerable embraces a minimalist design philosophy that prioritizes content and functionality over
            visual embellishments. Our interface is characterized by:
          </p>

          <div className="space-y-3">
            <div>
              <h3 className="text-base font-normal mb-1">Clean Typography</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We use a restrained typographic system with careful attention to hierarchy, spacing, and readability.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Reduced Visual Noise</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our interfaces eliminate unnecessary decorative elements to create a focused environment for learning and creation.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Consistent White Interface</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                A clean white background provides optimal contrast for content and reduces visual fatigue during extended use.
              </p>
            </div>

            <div>
              <h3 className="text-base font-normal mb-1">Purposeful Interactions</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every interactive element is designed with intention, providing clear feedback without unnecessary animation or effects.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <h2 className="text-lg font-normal mb-3">Open Source</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Tolerable is committed to open source development. Our codebase is available on
            <a href="https://github.com/tolerablecamp" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500 transition-colors duration-200"> GitHub</a>,
            where we welcome contributions from the community. We believe in transparent development and
            collaborative improvement of our platform.
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Tolerable. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
