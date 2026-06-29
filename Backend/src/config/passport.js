import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { UsersDB } from '../db/users.js';

export function configurePassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UsersDB.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackURL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback';

  if (!clientID || !clientSecret) {
    console.warn('[Passport] GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not defined in environment variables. GitHub OAuth will fail.');
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ['user:email', 'repo'], // Request email and repository access
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const githubId = parseInt(profile.id, 10);
          const username = profile.username || profile.displayName || `user-${githubId}`;
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

          console.log(`[Passport] User ${username} authenticating via GitHub ID: ${githubId}`);
          
          const user = await UsersDB.upsertUser({
            githubId,
            username,
            email,
            avatarUrl,
            accessToken,
          });

          return done(null, user);
        } catch (err) {
          console.error('[Passport] GitHub Strategy Verification Error:', err);
          return done(err, null);
        }
      }
    )
  );
}
