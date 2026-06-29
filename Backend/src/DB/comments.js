import { supabase } from './client.js';

export const CommentsDB = {
  /**
   * Bulk inserts comments for a specific review
   * @param {Array} commentsList 
   * @returns {Promise<Array>}
   */
  async saveComments(commentsList) {
    if (!supabase) return [];
    if (!commentsList || commentsList.length === 0) return [];

    const formattedComments = commentsList.map(c => ({
      review_id: c.reviewId,
      file_path: c.file || 'unknown',
      line_start: c.lineStart || null,
      line_end: c.lineEnd || null,
      severity: c.severity || 'INFO',
      category: c.category || 'style',
      title: c.title || 'Code Improvement',
      body: c.body || '',
      suggestion: c.suggestion || null,
      suggested_code: c.suggestedCode || null,
      embedding: c.embedding || null // Reserved for vector similarity search
    }));

    const { data, error } = await supabase
      .from('comments')
      .insert(formattedComments)
      .select();

    if (error) {
      console.error('[CommentsDB] Error saving comments:', error.message);
      throw error;
    }
    return data || [];
  },

  /**
   * Fetches all comments for a specific review
   * @param {string} reviewId 
   * @returns {Promise<Array>}
   */
  async getCommentsByReviewId(reviewId) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('review_id', reviewId);

    if (error) {
      console.error('[CommentsDB] Error fetching comments for review:', error.message);
      throw error;
    }
    return data || [];
  }
};
