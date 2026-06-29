import express from 'express';
import crypto from 'crypto';
import { ReviewEngine } from '../review/engine.js';
import { ReviewsDB } from '../db/reviews.js';
import { CommentsDB } from '../db/comments.js';
import { GitHubService } from '../services/github.js';

const router = express.Router();

// Initialize the neural review engine with environment config
const reviewEngine = new ReviewEngine(process.env);

// Auth validation middleware
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized. Please login first.' });
}

// Rate limit validation middleware (10 reviews/day limit for free tier)
async function rateLimitCheck(req, res, next) {
  try {
    const userId = req.user.id;
    const dailyCount = await ReviewsDB.getDailyReviewCount(userId);
    if (dailyCount >= 10) {
      return res.status(429).json({ 
        error: 'Daily review limit reached. You can run up to 10 reviews every 24 hours on the free tier.' 
      });
    }
    next();
  } catch (err) {
    console.error('[RateLimit] Error checking daily review count:', err);
    next(); // Proactively skip on DB errors to protect user flow
  }
}

// 1. POST /api/review - Direct Manual Review (uploader or pasted diff)
router.post('/', requireAuth, rateLimitCheck, async (req, res) => {
  const { diff, prTitle, prDescription, settings = {} } = req.body;

  if (!diff || diff.trim().length === 0) {
    return res.status(400).json({ error: 'Payload diff is empty.' });
  }

  if (diff.length > 50000) {
    return res.status(413).json({ error: 'Diff exceeds the 50,000 characters limit.' });
  }

  try {
    const userId = req.user.id;

    // Run review engine
    const reviewResult = await reviewEngine.runReview({
      diff,
      title: prTitle || 'Manual Code Upload',
      description: prDescription || '',
      settings
    });

    const diffHash = crypto.createHash('sha256').update(diff).digest('hex');

    // Save review header record
    const savedReview = await ReviewsDB.saveReview({
      userId,
      title: prTitle || 'Manual Code Upload',
      score: reviewResult.totalScore,
      summary: reviewResult.summary,
      providerUsed: reviewResult.fileResults[0]?.usedProvider || 'auto',
      diffHash,
      diff,
      tokensUsed: 0
    });

    // Extract comments and link them to this review
    const commentsList = [];
    reviewResult.fileResults.forEach(fileRes => {
      if (fileRes.comments && Array.isArray(fileRes.comments)) {
        fileRes.comments.forEach(c => {
          commentsList.push({
            ...c,
            reviewId: savedReview.id,
            file: c.file || fileRes.file
          });
        });
      }
    });

    // Save comments records in bulk
    const savedComments = await CommentsDB.saveComments(commentsList);

    return res.status(200).json({
      id: savedReview.id,
      score: savedReview.score,
      summary: savedReview.summary,
      providerUsed: savedReview.provider_used,
      comments: savedComments,
      positives: reviewResult.fileResults.flatMap(r => r.positives || []),
      missedTestCases: reviewResult.fileResults.flatMap(r => r.missedTestCases || []),
      createdAt: savedReview.created_at
    });

  } catch (err) {
    console.error('[ReviewRoute] Direct review run failed:', err.message);
    return res.status(500).json({ error: `Review processing failed: ${err.message}` });
  }
});

// 2. POST /api/review/github - Perform Review on a Pull Request
router.post('/github', requireAuth, rateLimitCheck, async (req, res) => {
  const { owner, repo, pullNumber, settings = {} } = req.body;

  if (!owner || !repo || !pullNumber) {
    return res.status(400).json({ error: 'Owner, repository name, and PR pull number are required.' });
  }

  try {
    const token = req.user.github_access_token;
    if (!token) {
      return res.status(400).json({ error: 'Access token not available. Reconnect GitHub.' });
    }

    console.log(`[ReviewRoute] Fetching pull request diff for: ${owner}/${repo} #${pullNumber}`);
    const diff = await GitHubService.getPullRequestDiff(token, owner, repo, pullNumber);

    if (!diff || diff.trim().length === 0) {
      return res.status(400).json({ error: 'No diff code changes found in this Pull Request.' });
    }

    if (diff.length > 50000) {
      return res.status(413).json({ error: 'Pull Request diff exceeds the 50,000 characters limit.' });
    }

    const userId = req.user.id;
    const title = `${owner}/${repo} (PR #${pullNumber})`;

    // Run review engine
    const reviewResult = await reviewEngine.runReview({
      diff,
      title,
      description: `GitHub PR #${pullNumber}`,
      settings
    });

    const diffHash = crypto.createHash('sha256').update(diff).digest('hex');

    // Save review header record
    const savedReview = await ReviewsDB.saveReview({
      userId,
      title,
      score: reviewResult.totalScore,
      summary: reviewResult.summary,
      providerUsed: reviewResult.fileResults[0]?.usedProvider || 'auto',
      diffHash,
      diff,
      tokensUsed: 0
    });

    // Link comments
    const commentsList = [];
    reviewResult.fileResults.forEach(fileRes => {
      if (fileRes.comments && Array.isArray(fileRes.comments)) {
        fileRes.comments.forEach(c => {
          commentsList.push({
            ...c,
            reviewId: savedReview.id,
            file: c.file || fileRes.file
          });
        });
      }
    });

    const savedComments = await CommentsDB.saveComments(commentsList);

    return res.status(200).json({
      id: savedReview.id,
      score: savedReview.score,
      summary: savedReview.summary,
      providerUsed: savedReview.provider_used,
      comments: savedComments,
      positives: reviewResult.fileResults.flatMap(r => r.positives || []),
      missedTestCases: reviewResult.fileResults.flatMap(r => r.missedTestCases || []),
      createdAt: savedReview.created_at
    });

  } catch (err) {
    console.error(`[ReviewRoute] GitHub PR review failed for ${owner}/${repo} #${pullNumber}:`, err.message);
    return res.status(500).json({ error: `GitHub PR Review failed: ${err.message}` });
  }
});

// 3. GET /api/reviews - List past 20 reviews for user (summary card list)
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await ReviewsDB.listReviewsByUser(userId, 20);
    return res.status(200).json({ reviews: list });
  } catch (err) {
    console.error('[ReviewRoute] Listing history failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// 4. GET /api/review/:id - Fetch full detailed review including comments
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const userId = req.user.id;
    const review = await ReviewsDB.getReviewById(id, userId);

    if (!review) {
      return res.status(404).json({ error: 'Review session not found or access denied.' });
    }

    const comments = await CommentsDB.getCommentsByReviewId(id);
    
    // Parse the diff on the backend so the frontend can easily render the DiffViewer
    let parsedDiff = [];
    if (review.diff) {
      try {
        const { DiffParser } = await import('../review/diffParser.js');
        parsedDiff = DiffParser.parse(review.diff);
      } catch (err) {
        console.error('[ReviewRoute] Failed to parse diff for detail response:', err.message);
      }
    }

    return res.status(200).json({
      ...review,
      comments,
      parsedDiff
    });
  } catch (err) {
    console.error(`[ReviewRoute] Fetching review details for ${id} failed:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
