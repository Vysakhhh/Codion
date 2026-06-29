import express from 'express';
import passport from 'passport';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Initiates GitHub OAuth Flow
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'repo'] }));

// GitHub OAuth Callback Route
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    console.log(`[AuthRoute] Successfully authenticated user ${req.user.username}`);
    // Redirect to Dashboard
    res.redirect(`${FRONTEND_URL}/`);
  }
);

// Get current logged-in user profile
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    // Exclude access token from public profile JSON response for security
    const { github_access_token, ...safeUser } = req.user;
    return res.status(200).json({ user: safeUser });
  }
  return res.status(401).json({ error: 'Unauthorized. No active session.' });
});

// Logout User
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.status(200).json({ message: 'Successfully logged out.' });
    });
  });
});

export default router;
