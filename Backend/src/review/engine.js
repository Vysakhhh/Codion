import { minimatch } from 'minimatch';
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

    // Filter ignored files from settings.ignoredPatterns
    let filesToReview = parsedFiles;
    if (settings && settings.ignoredPatterns && Array.isArray(settings.ignoredPatterns)) {
      filesToReview = parsedFiles.filter(file => {
        const filePath = file.to || file.from;
        if (!filePath) return true;
        
        const isIgnored = settings.ignoredPatterns.some(pattern => {
          try {
            return minimatch(filePath, pattern, { dot: true, matchBase: true });
          } catch (e) {
            console.error(`[ReviewEngine] Error matching pattern ${pattern}:`, e.message);
            return false;
          }
        });
        
        if (isIgnored) {
          console.log(`[ReviewEngine] Ignoring file: ${filePath}`);
        }
        return !isIgnored;
      });
    }

    if (filesToReview.length === 0) {
      return {
        totalScore: 100,
        filesReviewed: 0,
        fileResults: [],
        summary: 'All changed files were ignored based on your configuration patterns.',
        timestamp: new Date().toISOString()
      };
    }

    // 3. Process files in parallel
    const reviewPromises = filesToReview.map(async (file) => {
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
