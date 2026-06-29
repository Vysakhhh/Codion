import axios from 'axios';

export const GitHubService = {
  /**
   * Helper to build axios client with GitHub token
   */
  getClient(accessToken) {
    return axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Codion-AI-Code-Reviewer',
      },
    });
  },

  /**
   * Lists repositories for the authenticated user
   */
  async listRepos(accessToken) {
    const client = this.getClient(accessToken);
    try {
      // Sort by pushed to show active repositories first
      const response = await client.get('/user/repos', {
        params: {
          sort: 'pushed',
          per_page: 100,
        },
      });
      return response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        owner: {
          login: repo.owner.login,
          avatarUrl: repo.owner.avatar_url,
        },
        description: repo.description,
        isPrivate: repo.private,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
      }));
    } catch (err) {
      console.error('[GitHubService] Error listing repos:', err.response?.data || err.message);
      throw new Error(`Failed to list repositories: ${err.response?.data?.message || err.message}`);
    }
  },

  /**
   * Lists open pull requests for a repository
   */
  async listPullRequests(accessToken, owner, repo) {
    const client = this.getClient(accessToken);
    try {
      const response = await client.get(`/repos/${owner}/${repo}/pulls`, {
        params: {
          state: 'open',
          per_page: 30,
        },
      });
      return response.data.map(pr => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        description: pr.body || '',
        state: pr.state,
        url: pr.html_url,
        createdAt: pr.created_at,
        user: {
          login: pr.user.login,
          avatarUrl: pr.user.avatar_url,
        },
      }));
    } catch (err) {
      console.error('[GitHubService] Error listing pull requests:', err.response?.data || err.message);
      throw new Error(`Failed to list pull requests: ${err.response?.data?.message || err.message}`);
    }
  },

  /**
   * Fetches the raw diff content of a pull request
   */
  async getPullRequestDiff(accessToken, owner, repo, pullNumber) {
    const client = this.getClient(accessToken);
    try {
      const response = await client.get(`/repos/${owner}/${repo}/pulls/${pullNumber}`, {
        headers: {
          Accept: 'application/vnd.github.diff',
        },
        responseType: 'text',
      });
      return response.data;
    } catch (err) {
      console.error('[GitHubService] Error fetching PR diff:', err.response?.data || err.message);
      throw new Error(`Failed to fetch PR diff: ${err.response?.data?.message || err.message}`);
    }
  }
};
