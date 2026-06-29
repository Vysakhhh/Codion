import express from 'express';
import { GitHubService } from '../services/github.js';

const router = express.Router();

// Middleware to verify session authentication
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Authenticated session required.' });
}

// Fetch user's connected repositories
router.get('/', requireAuth, async (req, res) => {
  try {
    const token = req.user.github_access_token;
    if (!token) {
      return res.status(400).json({ error: 'No GitHub access token available. Please reconnect your account.' });
    }

    const repos = await GitHubService.listRepos(token);
    return res.status(200).json({ repos });
  } catch (err) {
    console.error('[ReposRoute] Fetching repositories failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Fetch repository open pull requests
router.get('/:owner/:repo/pulls', requireAuth, async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const token = req.user.github_access_token;
    if (!token) {
      return res.status(400).json({ error: 'No GitHub access token available. Please reconnect your account.' });
    }

    const pulls = await GitHubService.listPullRequests(token, owner, repo);
    return res.status(200).json({ pulls });
  } catch (err) {
    console.error(`[ReposRoute] Fetching PRs for ${owner}/${repo} failed:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
