import { supabase } from './client.js';

export const ReviewsDB = {
  /**
   * Saves a review metadata record
   */
  async saveReview({ userId, title, score, summary, providerUsed, diffHash, diff, tokensUsed }) {
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        title,
        score,
        summary,
        provider_used: providerUsed,
        diff_hash: diffHash,
        diff,
        tokens_used: tokensUsed || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('[ReviewsDB] Error saving review:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Retrieves a single review by id, validating user ownership
   */
  async getReviewById(id, userId) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[ReviewsDB] Error retrieving review by id:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Lists the latest reviews for a user (without detailed comments)
   */
  async listReviewsByUser(userId, limit = 20) {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('id, title, score, summary, provider_used, diff_hash, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[ReviewsDB] Error listing reviews for user:', error.message);
      throw error;
    }
    return data || [];
  },

  /**
   * Counts reviews completed by the user in the last 24 hours
   */
  async getDailyReviewCount(userId) {
    if (!supabase) return 0;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { count, error } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneDayAgo);

    if (error) {
      console.error('[ReviewsDB] Error counting daily reviews:', error.message);
      throw error;
    }
    return count || 0;
  }
};
