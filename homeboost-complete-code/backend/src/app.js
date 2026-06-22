import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { nanoid } from 'nanoid';
import { env, isProduction } from './config/env.js';
import { ok } from './utils/respond.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import publicPartnershipRoutes from './routes/publicPartnershipRoutes.js';
import partnershipRoutes from './routes/partnershipRoutes.js';
import employeePortalRoutes from './routes/employeePortalRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import hbtRoutes from './routes/hbtRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

export const app = express();

app.use((req, res, next) => {
  req.requestId = nanoid(10);
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = env.corsOrigin.split(',').map((item) => item.trim()).filter(Boolean);
    if (!isProduction || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => ok(res, {
  service: 'homeboost-api',
  status: 'healthy',
  requestId: req.requestId,
  timestamp: new Date().toISOString()
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/public-partnerships', publicPartnershipRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/employee-portal', employeePortalRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', cmsRoutes);
app.use('/api/hbts', hbtRoutes);
app.use('/api/enrollment', enrollmentRoutes);

app.use(notFound);
app.use(errorHandler);
