import React, { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import '../markdown-styles.css';
import LogoComponent from './LogoComponent';
import LoadingAnimation from './LoadingAnimation';

// Configure marked to allow HTML
marked.setOptions({
  gfm: true,
  breaks: true,
  sanitize: false, // Allow HTML in the markdown
  smartLists: true,
  smartypants: true,
});

const ConsolidatedChangelog = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const lastUpdated = 'April 10, 2025';

  // Function to strip YAML front matter from markdown content
  const stripFrontMatter = (txt) => {
    if (txt.trim().startsWith('---')) {
      const closingIndex = txt.indexOf('---', 3);
      if (closingIndex !== -1) {
        return txt.slice(closingIndex + 3).trim();
      }
    }
    return txt;
  };

  // Wrap fetchChangelog in useCallback so that it doesn't warn about missing dependency
  const fetchChangelog = useCallback(async (retryCount = 0) => {
    let debugMessages = [];
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      // Remove the /public/ path because files in public are served from the root
      // Add a random parameter to force cache busting
      const randomParam = Math.random().toString(36).substring(2, 15);
      const possiblePaths = [
        `/CHANGELOG.md?t=${timestamp}&r=${randomParam}`,
        `/docs/meta/CHANGELOG.md?t=${timestamp}&r=${randomParam}`
      ];

      debugMessages.push('Starting fetch of changelog...');
      let response = null;
      let currentPath = '';

      for (const path of possiblePaths) {
        try {
          currentPath = path;
          debugMessages.push(`Attempting to fetch from: ${path}`);
          const resp = await fetch(path, {
            method: 'GET',
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          if (resp.ok) {
            response = resp;
            debugMessages.push(`Successfully fetched from: ${path}`);
            break;
          } else {
            debugMessages.push(`Failed to fetch from ${path}, status: ${resp.status}`);
          }
        } catch (e) {
          debugMessages.push(`Error fetching from ${path}: ${e.message}`);
        }
      }

      if (!response || !response.ok) {
        throw new Error('Failed to fetch changelog from any known location');
      }

      debugMessages.push(`Loading changelog from: ${currentPath}`);
      let text = await response.text();

      // Check if the fetched content is HTML (which typically indicates an error response)
      if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
        debugMessages.push('Fetched content appears to be HTML rather than markdown.');
        throw new Error('Received HTML content instead of the changelog markdown.');
      }

      if (!text || text.trim() === '') {
        debugMessages.push('Received empty changelog content');
        throw new Error('Changelog file is empty');
      }

      text = stripFrontMatter(text);
      // Update the version date using flexible regex patterns to handle various formats
      // This handles formats like "## [1.0.0] - <date>" or "## Version 1.0.0 (<date>)"
      text = text.replace(/## \[1\.0\.0\] - .*$/m, '## [1.0.0] - April 10, 2025');
      text = text.replace(/(## Version\s+1\.0\.0\s*\(?)[^)]+\)?/i, '$1April 10, 2025)');
      text = text.replace(/(### Version\s+1\.0\.0\s*\(?)[^)]+\)?/i, '$1April 10, 2025)');
      text = text.replace(/(Version\s+1\.0\.0\s*\(?)[^)]+\)?/i, '$1April 10, 2025)');
      text = text.replace(/\[object Object\]/g, '');

      try {
        debugMessages.push('Attempting to parse markdown content');
        // Parse markdown to HTML
        const parsedContent = marked.parse(text);
        // Sanitize HTML but keep classes and styles
        const sanitizedContent = DOMPurify.sanitize(parsedContent, {
          ADD_ATTR: ['class', 'style'],
          ADD_TAGS: ['div', 'span']
        });
        setContent(sanitizedContent);
        debugMessages.push('Successfully parsed and sanitized markdown');
      } catch (parseError) {
        debugMessages.push(`Error parsing markdown: ${parseError.message}`);
        setContent(`<pre>${text}</pre>`);
      }

      setLoading(false);
      setError(null);
      setDebugInfo(debugMessages.join('\n'));
    } catch (err) {
      debugMessages.push(`Error loading changelog: ${err.message}`);
      console.error('Error loading changelog:', err);
      if (retryCount < 3) {
        debugMessages.push(`Retrying changelog fetch (${retryCount + 1}/3)...`);
        setDebugInfo(debugMessages.join('\n'));
        setTimeout(() => fetchChangelog(retryCount + 1), 1000);
        return;
      }
      // After retries fail, use fallback content
      setError('We couldn\'t load the latest changelog. Showing you our most recent updates instead.');
      const fallbackContent = `
        <h1>Documentation Changelog</h1>

        <h2>Ethics and Public Accountability</h2>
        <div class="ethics-section">
          <p class="ethics-intro">
            We recognize the responsibility that comes with building AI-powered systems, particularly those that interface with public data, content analysis, and decision-making processes. Our goal is to ensure transparency, fairness, and integrity in all aspects of development and deployment. As part of our commitment to public trust:
          </p>
          <ul class="ethics-principles">
            <li>We adhere to ethical AI practices and prioritize user consent and data privacy.</li>
            <li>We maintain documentation and changelogs to provide accountability and traceability of features and updates.</li>
            <li>We align our efforts with best practices in investigative integrity, justice, and democratic values, supporting responsible innovation in line with societal expectations and legal frameworks.</li>
          </ul>
        </div>

        <h2>National Security and Operational Excellence</h2>
        <div class="security-section">
          <p class="security-intro">
            The Tolerable platform is designed with a 360° approach to mission support, ensuring that operators have the tools they need to accomplish critical objectives. Our commitment to truth and accuracy drives every aspect of our development process, from initial design to deployment and ongoing maintenance.
          </p>
          <div class="milestone-highlight">
            <p>
              As of May 12, 2025, we have implemented enhanced operational protocols that deepen our commitment to mission success. This date marks a significant milestone in our development roadmap, with the integration of advanced capabilities that support the full spectrum of operator needs while maintaining the highest standards of ethical conduct and public accountability.
            </p>
          </div>
        </div>

        <h2>Document Control</h2>
        <div class="document-control">
          <div class="control-item">
            <span class="label">Version</span>
            <span class="value">1.1.0</span>
          </div>
          <div class="control-item">
            <span class="label">Last Updated</span>
            <span class="value">May 12, 2025</span>
          </div>
          <div class="control-item">
            <span class="label">Updated By</span>
            <span class="value">niladridas</span>
          </div>
          <div class="control-item">
            <span class="label">Classification</span>
            <span class="value">OPERATIONAL</span>
          </div>
          <div class="control-item">
            <span class="label">Review Status</span>
            <span class="value">APPROVED</span>
          </div>
          <div class="control-item">
            <span class="label">Next Review</span>
            <span class="value">May 12, 2026</span>
          </div>
        </div>

        <h2>Change History</h2>
        <div class="version-entry">
          <h3 class="version-title">Version 1.1.0 <span class="version-date">May 12, 2025</span></h3>
          <ul class="change-list">
            <li>Updated UI styling across all components to match Education page interface</li>
            <li>Implemented consistent white theme throughout the application</li>
            <li>Enhanced AI Usage Policy page with modern minimalist design</li>
            <li>Updated Changelog system with mission-critical operational protocols</li>
            <li>Improved documentation with 360° operational awareness framework</li>
            <li>Added National Security and Operational Excellence section to documentation</li>
            <li>Implemented May 12 operational cycle with enhanced security measures</li>
            <li>Standardized typography and visual elements for improved readability</li>
            <li>Optimized interface for operator-led mission execution</li>
          </ul>
        </div>

        <div class="version-entry">
          <h3 class="version-title">Version 1.0.0 <span class="version-date">April 10, 2025</span></h3>
          <ul class="change-list">
            <li>Established comprehensive mission documentation with operational protocols</li>
            <li>Implemented enhanced security measures for national security applications</li>
            <li>Integrated ethical guidelines for AI-powered systems with operational awareness</li>
            <li>Created accountability framework with detailed changelog for mission transparency</li>
            <li>Developed operator-focused interface optimized for mission-critical tasks</li>
            <li>Ensured truth and accuracy in all data processing with verification protocols</li>
            <li>Deployed advanced capabilities supporting the full spectrum of operator needs</li>
          </ul>
        </div>

        <div class="footer">
          <div class="footer-item">
            <span class="footer-label">Generated</span>
            <span class="footer-value">May 12, 2025</span>
          </div>
          <div class="footer-item">
            <span class="footer-label">Author</span>
            <span class="footer-value">niladridas</span>
          </div>
          <div class="footer-item">
            <span class="footer-label">Mission Status</span>
            <span class="footer-value status-active">ACTIVE</span>
          </div>
          <div class="footer-item">
            <span class="footer-label">Operational Cycle</span>
            <span class="footer-value">May 12, 2025 - May 12, 2026</span>
          </div>
        </div>
      `;
      setContent(fallbackContent);
      setLoading(false);
      setDebugInfo(debugMessages.join('\n'));
    }
  }, []);

  useEffect(() => {
    fetchChangelog();
  }, [fetchChangelog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--bg-primary)'}}>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-16 relative">
        {/* Header - Styled to match AI Usage Policy */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <LogoComponent className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-normal mb-1" style={{color: 'var(--text-primary)'}}>Changelog</h1>
          <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Last updated: {lastUpdated}</p>
          <button
            onClick={() => fetchChangelog()}
            className="mt-3 px-3 py-1.5 text-xs text-gray-500 hover:text-black transition-colors duration-200"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="flex items-start">
              <div className="ml-3">
                <p className="text-sm text-gray-500">{error}</p>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-2 text-xs">
                    <summary className="text-gray-500 cursor-pointer">Debug information</summary>
                    <pre className="mt-2 p-2 bg-white border border-gray-50 overflow-auto max-h-64 text-gray-500 text-xs">
                      {debugInfo}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div
            className="prose prose-sm max-w-none text-black changelog-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedChangelog;
