import { supabase } from './client.js';
import { encrypt, decrypt } from '../utils/crypto.js';

export const UsersDB = {
  /**
   * Finds a user by their GitHub numerical ID
   * @param {number|string} githubId 
   * @returns {Promise<Object|null>}
   */
  async findByGithubId(githubId) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('github_id', githubId)
      .maybeSingle();

    if (error) {
      console.error('[UsersDB] Error finding user by github_id:', error.message);
      throw error;
    }
    
    if (data && data.github_access_token) {
      try {
        data.github_access_token = decrypt(data.github_access_token);
      } catch (e) {
        console.error('[UsersDB] Failed to decrypt access token for user:', data.username, e.message);
      }
    }
    return data;
  },

  /**
   * Finds a user by their UUID primary key
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[UsersDB] Error finding user by id:', error.message);
      throw error;
    }

    if (data && data.github_access_token) {
      try {
        data.github_access_token = decrypt(data.github_access_token);
      } catch (e) {
        console.error('[UsersDB] Failed to decrypt access token for user:', data.username, e.message);
      }
    }
    return data;
  },

  /**
   * Creates or updates a user and their OAuth token
   */
  async upsertUser({ githubId, username, email, avatarUrl, accessToken }) {
    if (!supabase) return null;
    
    const encryptedToken = accessToken ? encrypt(accessToken) : null;

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          github_id: githubId,
          username,
          email,
          avatar_url: avatarUrl,
          github_access_token: encryptedToken,
        },
        { onConflict: 'github_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('[UsersDB] Error upserting user:', error.message);
      throw error;
    }

    if (data && data.github_access_token) {
      try {
        data.github_access_token = decrypt(data.github_access_token);
      } catch (e) {
        console.error('[UsersDB] Failed to decrypt access token for user:', data.username, e.message);
      }
    }
    return data;
  }
};
