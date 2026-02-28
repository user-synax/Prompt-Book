import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { corsOptions } from './config/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import promptRoutes from './routes/prompt.routes';
import aiRoutes from './routes/ai.routes';
import publicRoutes from './routes/public.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// NoSQL injection prevention
app.use(mongoSanitize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
