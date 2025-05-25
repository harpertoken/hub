/**
 * ArXiv Research Paper Search Implementation
 * 
 * This module provides functionality to search for academic research papers
 * from ArXiv using their API. It uses regex-based XML parsing for better
 * reliability and performance.
 * 
 * @author Tolerable Development Team
 * @version 1.0.0
 */

const axios = require('axios');

/**
 * Searches ArXiv for academic research papers
 * 
 * @param {string} query - The search query
 * @param {number} numResults - Maximum number of results to return (default: 5)
 * @returns {Promise<Object>} Object containing results array and error (if any)
 */
async function searchArxiv(query, numResults = 5) {
  try {
    console.log(`Searching ArXiv for: "${query}" (max results: ${numResults})`);

    // Extract the first word from the query for more reliable results
    // This approach gives better results than complex multi-word queries
    const firstWord = query.trim().split(/\s+/)[0];
    console.log(`Using simplified query: "${firstWord}"`);

    // Build the ArXiv API URL with proper encoding
    // Using title search (ti:) for more precise results
    const encodedQuery = encodeURIComponent(firstWord);
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=ti:${encodedQuery}&start=0&max_results=${numResults}&sortBy=relevance&sortOrder=descending`;
    
    console.log(`ArXiv API URL: ${arxivUrl}`);

    // Make the request to ArXiv API
    const response = await axios.get(arxivUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Tolerable-Education-App/1.0'
      }
    });

    console.log(`ArXiv API response status: ${response.status}`);
    console.log(`ArXiv API response length: ${response.data.length} characters`);

    // Parse the XML response using regex
    const xmlData = response.data;
    
    // Extract all entry elements using regex
    const entryMatches = xmlData.match(/<entry>[\s\S]*?<\/entry>/g);
    
    if (!entryMatches || entryMatches.length === 0) {
      console.log('No ArXiv entries found in response');
      return { 
        results: [], 
        error: null,
        message: 'No ArXiv papers found for this query'
      };
    }

    console.log(`Found ${entryMatches.length} ArXiv entries`);

    // Process each entry
    const results = [];
    entryMatches.forEach((entryXml, index) => {
      try {
        // Extract title (remove newlines and extra spaces)
        const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Untitled';

        // Extract summary (remove newlines and extra spaces)
        const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
        const summary = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim() : 'No summary available';

        // Extract ArXiv ID and construct link
        const idMatch = entryXml.match(/<id>([\s\S]*?)<\/id>/);
        const arxivId = idMatch ? idMatch[1].trim() : '';
        const link = arxivId || `https://arxiv.org/search/?query=${encodedQuery}`;

        // Extract authors (they are in <name> tags within <author> tags)
        const authorMatches = entryXml.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g);
        let authors = 'Authors not specified';
        if (authorMatches && authorMatches.length > 0) {
          const authorNames = authorMatches.map(authorXml => {
            const nameMatch = authorXml.match(/<name>([\s\S]*?)<\/name>/);
            return nameMatch ? nameMatch[1].trim() : '';
          }).filter(name => name.length > 0);
          
          if (authorNames.length > 0) {
            authors = authorNames.length > 3 
              ? `${authorNames.slice(0, 3).join(', ')} et al.`
              : authorNames.join(', ');
          }
        }

        // Extract publication date
        const publishedMatch = entryXml.match(/<published>([\s\S]*?)<\/published>/);
        const publishedDate = publishedMatch ? publishedMatch[1].trim().split('T')[0] : null;

        // Create result object
        const result = {
          title: title,
          link: link,
          snippet: summary.length > 200 ? summary.substring(0, 200) + '...' : summary,
          source: 'arxiv.org',
          authors: authors,
          date: publishedDate
        };

        results.push(result);
        console.log(`Processed ArXiv entry ${index + 1}: "${title.substring(0, 50)}..."`);
      } catch (entryError) {
        console.error(`Error processing ArXiv entry ${index + 1}:`, entryError.message);
      }
    });

    console.log(`Successfully processed ${results.length} ArXiv results`);

    return {
      results: results,
      error: null,
      message: `Found ${results.length} ArXiv papers`
    };

  } catch (error) {
    console.error('Error searching ArXiv:', error.message);
    
    // Return appropriate error message based on error type
    let errorMessage = 'Error searching ArXiv papers';
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'ArXiv API is currently unavailable';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'ArXiv search request timed out';
    } else if (error.response && error.response.status) {
      errorMessage = `ArXiv API error: ${error.response.status}`;
    }

    return {
      results: [],
      error: errorMessage,
      message: 'ArXiv search failed'
    };
  }
}

module.exports = searchArxiv;
