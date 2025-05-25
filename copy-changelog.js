/**
 * Tolerable Changelog Management System
 *
 * This script manages the changelog for the Tolerable platform, ensuring that
 * mission-critical information is properly documented and distributed across
 * the application. It supports our commitment to transparency, accountability,
 * and operational excellence in national security contexts.
 *
 * The 360° experience we provide depends on accurate, up-to-date documentation
 * that reflects our operator-led mission and dedication to truth.
 *
 * The changelog follows the minimalist UI design principles used in the Education
 * component, with clean typography, consistent spacing, and a white background
 * for optimal readability and visual harmony.
 */

const fs = require('fs');
const path = require('path');

/**
 * Mission-critical operational dates
 * These dates are hardcoded to ensure consistency across all documentation
 */
// Using these dates directly in the code for clarity

/**
 * Sanitizes content to ensure data integrity
 * Critical for maintaining accurate operational records
 */
const cleanupContent = (content) => {
  // Remove garbage strings like [object Object]
  return content.replace(/\[object Object\]/g, '');
};

/**
 * Creates a comprehensive fallback changelog when the source is not available
 * Ensures mission continuity and operational integrity
 */
const createFallbackContent = () => {
  const username = 'NILADRI DAS';

  // Format the username with both first name and surname uppercase
  const formattedUsername = username.includes(' ')
    ? username.replace(/^(.*) (.*)$/i, function(_, p1, p2) {
        return p1.toUpperCase() + ' ' + p2.toUpperCase();
      })
    : username.toUpperCase();

  return `---
title: Tolerable Changelog
version: 1.2.0
last_updated: 2025-05-12 12:00:00 UTC
last_updated_by: ${formattedUsername}
security_classification: OPERATIONAL
review_status: APPROVED
reviewers: [${formattedUsername}]
---

# Tolerable Changelog

## Ethics and Public Accountability

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

## National Security and Operational Excellence

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

## Document Control

<div class="document-control">
  <div class="control-item">
    <span class="label">Version</span>
    <span class="value">1.2.0</span>
  </div>
  <div class="control-item">
    <span class="label">Last Updated</span>
    <span class="value">May 12, 2025</span>
  </div>
  <div class="control-item">
    <span class="label">Updated By</span>
    <span class="value">${formattedUsername}</span>
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

## Change History

<div class="version-history">
  <div class="version-entry">
    <h3 class="version-title">Version 1.2.0 <span class="version-date">May 12, 2025</span></h3>
    <ul class="change-list">
      <li>Added new EDI (Editor Development Interface) page with code editor functionality</li>
      <li>Improved GitHub repository analysis display for better readability</li>
      <li>Removed redundant "Speak Response" button in SpeakSphere for cleaner interface</li>
      <li>Corrected text-to-speech attribution to accurately reflect Google AI usage</li>
      <li>Enhanced code execution environment in EDI with proper error handling</li>
      <li>Added AI assistance for code editing using Gemini 1.5 Flash</li>
      <li>Implemented truthful system attributions across all components</li>
      <li>Fixed accessibility issues in markdown rendering components</li>
      <li>Added entry point to EDI from Education page for seamless navigation</li>
    </ul>
  </div>

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


</div>

<div class="footer">
  <div class="footer-item">
    <span class="footer-label">Generated</span>
    <span class="footer-value">May 12, 2025</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Author</span>
    <span class="footer-value">NILADRI DAS</span>
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
};

/**
 * Distributes changelog content to multiple locations
 * Ensures consistent documentation across all operational touchpoints
 * Critical for maintaining the 360° mission awareness
 */
const writeChangelogCopies = (content, destPaths) => {
  destPaths.forEach(dest => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dest, content);
    console.log(`✅ CHANGELOG.md successfully copied to:\n   - ${dest}`);
  });
};

// Define operational directories for mission documentation
const publicDir = path.join(__dirname, 'public');
const sourceCandidates = [
  path.join(__dirname, 'docs', 'meta', 'CHANGELOG.md'),
  path.join(__dirname, 'CHANGELOG.md')
];

// Locate primary source document using operational protocols
let sourcePath = sourceCandidates.find(p => fs.existsSync(p)) || sourceCandidates[0];
let changelogContent = '';

/**
 * Main operational execution block
 * Implements mission-critical documentation protocols with fallback contingencies
 */
try {
  // Initialize username variables at the top level
  // For demonstration purposes, use a name with a surname
  const username = 'NILADRI DAS';
  let formattedUsername = username.includes(' ')
    ? username.replace(/^(.*) (.*)$/i, function(_, p1, p2) {
        return p1.toUpperCase() + ' ' + p2.toUpperCase();
      })
    : username.toUpperCase();

  if (fs.existsSync(sourcePath)) {
    console.log(`Reading changelog from: ${sourcePath}`);
    // Secure document retrieval
    changelogContent = fs.readFileSync(sourcePath, 'utf8');
    // Data sanitization for operational integrity
    changelogContent = cleanupContent(changelogContent);

    // Update the dates and version to May 12, 2025
    changelogContent = changelogContent.replace(/last_updated: .*$/m, 'last_updated: 2025-05-12 12:00:00 UTC');
    changelogContent = changelogContent.replace(/Last Updated\s+\|\s+.*$/m, 'Last Updated         | May 12, 2025  |');
    changelogContent = changelogContent.replace(/Next Review Date\s+\|\s+.*$/m, 'Next Review Date     | May 12, 2026  |');
    changelogContent = changelogContent.replace(/Version \d+\.\d+\.\d+ \(.*?\)/g, 'Version 1.2.0 (May 12, 2025)');
    changelogContent = changelogContent.replace(/Generated: .*$/m, 'Generated: May 12, 2025');

    // Update version number in the header
    changelogContent = changelogContent.replace(/^version: \d+\.\d+\.\d+/m, 'version: 1.2.0');

    // Update version number in document control
    changelogContent = changelogContent.replace(/\| Version\s+\|\s+\d+\.\d+\.\d+\s+\|/m, '| Version              | 1.2.0           |');

    // Update version number in document control div
    changelogContent = changelogContent.replace(/<span class="label">Version<\/span>\s*<span class="value">\d+\.\d+\.\d+<\/span>/m,
      '<span class="label">Version</span>\n    <span class="value">1.2.0</span>');

    // Update the username in the header
    changelogContent = changelogContent.replace(/^last_updated_by: .*$/m, `last_updated_by: ${formattedUsername}`);
    changelogContent = changelogContent.replace(/^reviewers: \[.*\]$/m, `reviewers: [${formattedUsername}]`);

    // Format the username with both first name and surname uppercase
    formattedUsername = username.includes(' ')
      ? username.replace(/^(.*) (.*)$/i, function(_, p1, p2) {
          return p1.toUpperCase() + ' ' + p2.toUpperCase();
        })
      : username.toUpperCase();

    // Update Document Control section to match Education UI
    if (changelogContent.includes('document-control')) {
      // If document-control already exists, update the username
      changelogContent = changelogContent.replace(
        /<span class="label">Updated By<\/span>\s*<span class="value">[^<]*<\/span>/,
        `<span class="label">Updated By</span>\n    <span class="value">${formattedUsername}</span>`
      );

      // Also update any instances of niladridas in the content
      changelogContent = changelogContent.replace(
        /<span class="value">niladridas<\/span>/g,
        `<span class="value">${formattedUsername}</span>`
      );
    } else {
      const docControlMatch = changelogContent.match(/## Document Control\s+\n\|\s*Metadata.*?\|\s*Value.*?\|([\s\S]*?)(?=\n\n##)/);
      if (docControlMatch) {

        const newDocControl = `<div class="document-control">
  <div class="control-item">
    <span class="label">Version</span>
    <span class="value">1.2.0</span>
  </div>
  <div class="control-item">
    <span class="label">Last Updated</span>
    <span class="value">May 12, 2025</span>
  </div>
  <div class="control-item">
    <span class="label">Updated By</span>
    <span class="value">${formattedUsername}</span>
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
</div>`;

        changelogContent = changelogContent.replace(/## Document Control\s+\n\|\s*Metadata.*?\|\s*Value.*?\|[\s\S]*?(?=\n\n##)/, `## Document Control\n\n${newDocControl}\n\n`);
      }
    }

    // Update security classification to OPERATIONAL
    changelogContent = changelogContent.replace(/security_classification: .*$/m, 'security_classification: OPERATIONAL');
    changelogContent = changelogContent.replace(/Classification\s+\|\s+.*$/m, 'Classification       | OPERATIONAL    |');

    // Update footer to match Education UI
    // This will always update the footer regardless of its current state

    // First, check if there's a traditional footer format
    if (changelogContent.includes('---\nGenerated:')) {
      changelogContent = changelogContent.replace(/---\nGenerated:.*?(?=\n\n|$)/s, `<div class="footer">
  <div class="footer-item">
    <span class="footer-label">Generated</span>
    <span class="footer-value">May 12, 2025</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Author</span>
    <span class="footer-value">${formattedUsername}</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Mission Status</span>
    <span class="footer-value status-active">ACTIVE</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Operational Cycle</span>
    <span class="footer-value">May 12, 2025 - May 12, 2026</span>
  </div>
</div>`);
    }
    // If there's no traditional footer but there's no styled footer either, add it at the end
    else if (!changelogContent.includes('footer-item')) {
      // Add the footer at the end of the document
      changelogContent = changelogContent.trim() + `\n\n<div class="footer">
  <div class="footer-item">
    <span class="footer-label">Generated</span>
    <span class="footer-value">May 12, 2025</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Author</span>
    <span class="footer-value">${formattedUsername}</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Mission Status</span>
    <span class="footer-value status-active">ACTIVE</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Operational Cycle</span>
    <span class="footer-value">May 12, 2025 - May 12, 2026</span>
  </div>
</div>\n`;
    }

    // Fix any unresolved template literals in the content
    changelogContent = changelogContent.replace(/\${process\.env\.USER.*?}/g, process.env.USER || 'niladridas');

    // Direct replacement of the footer section
    if (changelogContent.includes('<div class="footer">')) {
      const footerSection = `<div class="footer">
  <div class="footer-item">
    <span class="footer-label">Generated</span>
    <span class="footer-value">May 12, 2025</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Author</span>
    <span class="footer-value">NILADRI DAS</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Mission Status</span>
    <span class="footer-value status-active">ACTIVE</span>
  </div>
  <div class="footer-item">
    <span class="footer-label">Operational Cycle</span>
    <span class="footer-value">May 12, 2025 - May 12, 2026</span>
  </div>
</div>`;

      changelogContent = changelogContent.replace(
        /<div class="footer">[\s\S]*?<\/div>\s*<\/div>/,
        footerSection
      );
    }

    // Update Ethics section to match Education UI
    if (!changelogContent.includes('ethics-section')) {
      const ethicsMatch = changelogContent.match(/## Ethics and Public Accountability\s+\n([\s\S]*?)(?=\n\n##)/);
      if (ethicsMatch) {
        const newEthicsSection = `<div class="ethics-section">
  <p class="ethics-intro">
    We recognize the responsibility that comes with building AI-powered systems, particularly those that interface with public data, content analysis, and decision-making processes. Our goal is to ensure transparency, fairness, and integrity in all aspects of development and deployment. As part of our commitment to public trust:
  </p>

  <ul class="ethics-principles">
    <li>We adhere to ethical AI practices and prioritize user consent and data privacy.</li>
    <li>We maintain documentation and changelogs to provide accountability and traceability of features and updates.</li>
    <li>We align our efforts with best practices in investigative integrity, justice, and democratic values, supporting responsible innovation in line with societal expectations and legal frameworks.</li>
  </ul>
</div>`;

        changelogContent = changelogContent.replace(/## Ethics and Public Accountability\s+\n[\s\S]*?(?=\n\n##)/, `## Ethics and Public Accountability\n\n${newEthicsSection}\n\n`);
      }
    }

    // Update National Security and Operational Excellence section to match Education UI
    if (changelogContent.includes('National Security and Operational Excellence') && !changelogContent.includes('security-section')) {
      const securityMatch = changelogContent.match(/## National Security and Operational Excellence\s+\n([\s\S]*?)(?=\n\n##)/);
      if (securityMatch) {
        const newSecuritySection = `<div class="security-section">
  <p class="security-intro">
    The Tolerable platform is designed with a 360° approach to mission support, ensuring that operators have the tools they need to accomplish critical objectives. Our commitment to truth and accuracy drives every aspect of our development process, from initial design to deployment and ongoing maintenance.
  </p>

  <div class="milestone-highlight">
    <p>
      As of May 12, 2025, we have implemented enhanced operational protocols that deepen our commitment to mission success. This date marks a significant milestone in our development roadmap, with the integration of advanced capabilities that support the full spectrum of operator needs while maintaining the highest standards of ethical conduct and public accountability.
    </p>
  </div>
</div>`;

        changelogContent = changelogContent.replace(/## National Security and Operational Excellence\s+\n[\s\S]*?(?=\n\n##)/, `## National Security and Operational Excellence\n\n${newSecuritySection}\n\n`);
      }
    } else if (!changelogContent.includes('National Security and Operational Excellence')) {
      // Add section if it doesn't exist
      const ethicsSection = changelogContent.match(/## Ethics and Public Accountability[\s\S]*?(?=##)/);
      if (ethicsSection) {
        const nationalSecuritySection = `\n## National Security and Operational Excellence\n
<div class="security-section">
  <p class="security-intro">
    The Tolerable platform is designed with a 360° approach to mission support, ensuring that operators have the tools they need to accomplish critical objectives. Our commitment to truth and accuracy drives every aspect of our development process, from initial design to deployment and ongoing maintenance.
  </p>

  <div class="milestone-highlight">
    <p>
      As of May 12, 2025, we have implemented enhanced operational protocols that deepen our commitment to mission success. This date marks a significant milestone in our development roadmap, with the integration of advanced capabilities that support the full spectrum of operator needs while maintaining the highest standards of ethical conduct and public accountability.
    </p>
  </div>
</div>\n\n`;

        changelogContent = changelogContent.replace(ethicsSection[0], ethicsSection[0] + nationalSecuritySection);
      }
    }

    // Always ensure the changelog has the latest version history with Education UI styling
    // This is the definitive version history that will be applied regardless of the current content
    const definedChangeHistory = `<div class="version-history">
  <div class="version-entry">
    <h3 class="version-title">Version 1.2.0 <span class="version-date">May 12, 2025</span></h3>
    <ul class="change-list">
      <li>Added new EDI (Editor Development Interface) page with code editor functionality</li>
      <li>Improved GitHub repository analysis display for better readability</li>
      <li>Removed redundant "Speak Response" button in SpeakSphere for cleaner interface</li>
      <li>Corrected text-to-speech attribution to accurately reflect Google AI usage</li>
      <li>Enhanced code execution environment in EDI with proper error handling</li>
      <li>Added AI assistance for code editing using Gemini 1.5 Flash</li>
      <li>Implemented truthful system attributions across all components</li>
      <li>Fixed accessibility issues in markdown rendering components</li>
      <li>Added entry point to EDI from Education page for seamless navigation</li>
    </ul>
  </div>

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
</div>`;

    // Always replace the entire change history section to ensure consistency
    if (changelogContent.includes('## Change History')) {
      // If there's already a Change History section, replace it
      changelogContent = changelogContent.replace(/## Change History\s+\n[\s\S]*?(?=\n\n<div class="footer"|$)/, `## Change History\n\n${definedChangeHistory}\n\n`);
    } else {
      // If there's no Change History section, add it before the footer
      const footerMatch = changelogContent.match(/<div class="footer"/);
      if (footerMatch) {
        const footerIndex = changelogContent.indexOf('<div class="footer"');
        changelogContent = changelogContent.substring(0, footerIndex) +
                          `\n## Change History\n\n${definedChangeHistory}\n\n\n` +
                          changelogContent.substring(footerIndex);
      } else {
        // If there's no footer either, add it at the end
        changelogContent = changelogContent.trim() + `\n\n## Change History\n\n${definedChangeHistory}\n`;
      }
    }

    // Fix any version entries that aren't wrapped in version-history
    if (changelogContent.includes('<div class="version-entry"') && !changelogContent.includes('<div class="version-history"')) {
      changelogContent = changelogContent.replace(
        /## Change History\s+\n\s*<div class="version-entry"/,
        '## Change History\n\n<div class="version-history">\n  <div class="version-entry"'
      );

      // Close the version-history div before the footer
      if (changelogContent.includes('<div class="footer"')) {
        changelogContent = changelogContent.replace(
          /(<\/div>\s*\n\s*\n\s*)<div class="footer"/,
          '$1</div>\n\n<div class="footer"'
        );
      }
    }

    // Normalize source document for consistency
    fs.writeFileSync(sourcePath, changelogContent);
  } else {
    console.warn(`MISSION ALERT: Primary documentation not found. Implementing contingency protocol at: ${sourcePath}`);
    // Generate mission-compliant fallback documentation
    changelogContent = createFallbackContent();
    // Ensure directory structure exists for mission continuity
    fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
    // Deploy fallback documentation
    fs.writeFileSync(sourcePath, changelogContent);
  }

  // Define distribution targets for 360° operational awareness
  const destPaths = [
    path.join(publicDir, 'CHANGELOG.md'),
    path.join(publicDir, 'docs', 'meta', 'CHANGELOG.md')
  ];

  // Execute distribution protocol
  writeChangelogCopies(changelogContent, destPaths);

} catch (err) {
  console.error('CRITICAL MISSION EXCEPTION: Documentation protocol failure:', err.message);
  console.log('Initiating emergency contingency protocol...');

  // Generate emergency fallback documentation
  changelogContent = createFallbackContent();

  // Define emergency distribution targets
  const fallbackDest = [
    path.join(publicDir, 'CHANGELOG.md'),
    path.join(publicDir, 'docs', 'meta', 'CHANGELOG.md')
  ];

  // Execute emergency distribution protocol
  writeChangelogCopies(changelogContent, fallbackDest);

  console.log('Emergency protocol completed. Mission documentation secured.');
}
