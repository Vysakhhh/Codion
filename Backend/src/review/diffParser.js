import parse from 'parse-diff';

/**
 * ParsedDiff object
 * @typedef {Object} ParsedFile
 * @property {string} to - New file path
 * @property {string} from - Old file path
 * @property {boolean} new - Is new file
 * @property {boolean} deleted - Is deleted file
 * @property {Array} chunks - Content hunks
 */

export class DiffParser {
  /**
   * Parses a raw unified diff string into structured objects
   * @param {string} rawDiff 
   * @returns {ParsedFile[]}
   */
  static parse(rawDiff) {
    if (!rawDiff) return [];
    
    try {
      const files = parse(rawDiff);
      
      return files.map(file => ({
        to: file.to,
        from: file.from,
        new: file.new,
        deleted: file.deleted,
        chunks: file.chunks,
        language: this.detectLanguage(file.to || file.from)
      }));
    } catch (err) {
      console.error('[DiffParser] Failed to parse diff:', err.message);
      return [];
    }
  }

  static detectLanguage(filePath) {
    if (!filePath) return 'unknown';
    const ext = filePath.split('.').pop().toLowerCase();
    
    const map = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      py: 'python',
      go: 'go',
      rs: 'rust',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      cs: 'csharp',
      rb: 'ruby',
      php: 'php',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown'
    };

    return map[ext] || 'text';
  }
}
