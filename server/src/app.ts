import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';

const app = express();

// ─── Security Middleware ──────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Smart Leads API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ─── 404 Handler ──────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

export default app;
