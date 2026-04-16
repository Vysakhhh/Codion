import { DiffParser } from './diffParser.js';
import { ContextBuilder } from './contextBuilder.js';
import { LLMRouter } from '../llm/router.js';

export class ReviewEngine {
  constructor(config) {
    this.router = new LLMRouter(config);
  }

  /**
   * Orchestrates the review flow
   * @param {Object} input - { diff, title, description, settings }
   * @returns {Promise<Object>} - Aggregated ReviewResults
   */
  async runReview({ diff, title, description, settings }) {
    console.log('[ReviewEngine] Starting assessment...');
    
    // 1. Format metadata
    const metadata = { title, description };
    
    // 2. Parse Diff
    const parsedFiles = DiffParser.parse(diff);
    if (parsedFiles.length === 0) {
      throw new Error('No files found in the provided diff.');
    }

    // 3. Process files in parallel
    const reviewPromises = parsedFiles.map(async (file) => {
      try {
        const packet = ContextBuilder.build(file, metadata, settings);
        const result = await this.router.review(packet);
        
        return {
          file: file.to || file.from,
          ...result
        };
      } catch (err) {
        console.error(`[ReviewEngine] Error reviewing ${file.to || file.from}:`, err.message);
        return {
          file: file.to || file.from,
          score: 100,
          summary: `Failed to review this file: ${err.message}`,
          comments: [],
          positives: [],
          error: true
        };
      }
    });

    const fileResults = await Promise.all(reviewPromises);

    // 4. Aggregrate results
    return this.aggregate(fileResults);
  }

  aggregate(results) {
    const validResults = results.filter(r => !r.error);
    const avgScore = validResults.length > 0
      ? Math.round(validResults.reduce((acc, r) => acc + r.score, 0) / validResults.length)
      : 100;

    return {
      totalScore: avgScore,
      filesReviewed: results.length,
      fileResults: results,
      summary: validResults.length > 0 
        ? `Analysis complete. Found ${validResults.reduce((acc, r) => acc + r.comments.length, 0)} issues across ${validResults.length} files.`
        : 'Could not generate a detailed summary due to provider errors.',
      timestamp: new Date().toISOString()
    };
  }
}
