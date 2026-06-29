import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';

// Import Passport Config
import { configurePassport } from './src/config/passport.js';

// Import Routers
import authRoutes from './src/routes/auth.js';
import reposRoutes from './src/routes/repos.js';
import reviewRoutes from './src/routes/review.js';

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 3000;

// Security and CORS middleware
app.use(helmet());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'codion-ai-reviewer-super-secret-key-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Initialize Passport Session authentication
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// API Routers
app.use('/api/auth', authRoutes);
app.use('/api/repos', reposRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/reviews', reviewRoutes); // Mount to reviews list endpoint as well

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Server] Codion core API started running on port: ${PORT}`);
  console.log(`[Server] Secure session cookie sameSite setup: ${process.env.NODE_ENV === 'production' ? 'none' : 'lax'}`);
});
