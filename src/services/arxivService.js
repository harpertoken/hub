import axios from 'axios';

/**
 * Searches ArXiv for academic papers using their API
 * @param {string} query - The search query
 * @param {number} numResults - Number of results to return (default: 5)
 * @returns {Promise<{results: Array<Object>, error: string|null}>} - Object with results array and error (if any)
 */
async function searchArxiv(query, numResults = 5) {
  try {
    console.log(`Searching ArXiv for: "${query}"`);

    // Build the ArXiv API URL with proper encoding
    const encodedQuery = encodeURIComponent(query.replace(/\s+/g, '+AND+'));
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${encodedQuery}&start=0&max_results=${numResults}&sortBy=relevance&sortOrder=descending`;

    console.log(`ArXiv URL: ${arxivUrl}`);

    // Make the request
    const response = await axios.get(arxivUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Tolerable-App/1.0'
      }
    });

    // Parse the XML response
    const xmlData = response.data;
    const entryMatches = xmlData.match(/<entry>([\s\S]*?)<\/entry>/g);

    if (!entryMatches) {
      console.log('No ArXiv results found');
      return { results: [], error: 'No ArXiv results found' };
    }

    // Process each entry
    const entries = [];
    entryMatches.forEach((entryXml) => {
      try {
        // Extract title
        const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';

        // Extract summary
        const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
        const summary = summaryMatch ? summaryMatch[1].trim() : '';

        // Extract link (ID)
        const linkMatch = entryXml.match(/<id>([\s\S]*?)<\/id>/);
        const link = linkMatch ? linkMatch[1].trim() : '';

        // Extract authors
        const authorMatches = entryXml.match(/<author>([\s\S]*?)<\/author>/g);
        let authors = 'Unknown Authors';
        if (authorMatches) {
          const authorNames = authorMatches.map(authorXml => {
            const nameMatch = authorXml.match(/<name>([\s\S]*?)<\/name>/);
            return nameMatch ? nameMatch[1].trim() : '';
          }).filter(name => name);
          authors = authorNames.join(', ');
        }

        // Extract published date
        const publishedMatch = entryXml.match(/<published>([\s\S]*?)<\/published>/);
        const published = publishedMatch ? publishedMatch[1].trim() : null;

        // Create a clean snippet from the summary
        const snippet = summary.length > 200 ? `${summary.substring(0, 200)}...` : summary;

        entries.push({
          title,
          link,
          snippet,
          authors,
          date: published,
          source: 'arxiv.org'
        });
      } catch (entryError) {
        console.error('Error parsing ArXiv entry:', entryError);
        // Continue with other entries
      }
    });

    console.log(`Found ${entries.length} ArXiv results`);
    return { results: entries, error: null };
  } catch (error) {
    console.error('Error searching ArXiv:', error);
    return {
      results: [],
      error: `Error searching ArXiv: ${error.message}`
    };
  }
}

export default searchArxiv;
