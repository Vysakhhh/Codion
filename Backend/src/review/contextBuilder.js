/**
 * ContextBuilder
 * 
 * Responsible for assembling the ReviewPacket sent to the LLM.
 * It combines the diff hunks with surrounding code for better AI reasoning.
 */
export class ContextBuilder {
  /**
   * Builds context packets for each file in the diff
   * @param {Object} file - ParsedFile from DiffParser
   * @param {Object} metadata - PR title, description, etc.
   * @param {Object} settings - User settings
   * @returns {Object} ReviewPacket
   */
  static build(file, metadata, settings) {
    // Collect all hunks into a unified patch string for this file
    const patch = file.chunks.map(chunk => {
      const header = `@@ -${chunk.from},${chunk.fromLines} +${chunk.to},${chunk.toLines} @@\n`;
      const lines = chunk.changes.map(c => {
        const prefix = c.type === 'add' ? '+' : c.type === 'del' ? '-' : ' ';
        return prefix + c.content;
      }).join('\n');
      return header + lines;
    }).join('\n\n');

    // For MVP, we pass the hunks themselves as the primary context.
    // In Phase 4, we will enhance this by pulling full file content 
    // from Supabase/GitHub to provide a 30-line buffer.
    const context = `File: ${file.to}\n` + 
      file.chunks.map(c => `Hunk at line ${c.to}:\n${c.changes.filter(ch => ch.type === 'normal').map(ch => ch.content).join('\n')}`).join('\n---\n');

    return {
      filePath: file.to || file.from,
      language: file.language,
      patch: patch,
      context: context,
      prTitle: metadata.title || 'Untitled Review',
      prDescription: metadata.description || 'No description provided.',
      settings: settings
    };
  }
}
