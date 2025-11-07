import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import * as Sentry from '@sentry/node';
import rateLimit from 'express-rate-limit';
import { connectDB } from './lib/db.js';
import { analyzeResume, generateLinkedInBio, rewriteBullets } from './routes/analysis.js';
import { getRecentAnalyses, getAnalysisById } from './routes/resumes.js';
import { createOrder, verifyPayment } from './routes/payments.js';
import { authOptional } from './middleware/auth.js';
import { generateTemplate, generateTemplateImage } from './routes/templates.js';
import { r2PutUrl, r2GetUrl, enqueueJob } from './routes/ops.js';
import User from './models/User.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
  const reqMw = (Sentry.Handlers && typeof Sentry.Handlers.requestHandler === 'function'
    ? Sentry.Handlers.requestHandler()
    : (typeof Sentry.requestHandler === 'function' ? Sentry.requestHandler() : null));
  if (reqMw) app.use(reqMw);
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false }));
app.use(authOptional);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/analysis/analyze', upload.single('resume'), analyzeResume);
app.post('/api/analysis/bio', upload.single('resume'), generateLinkedInBio);
app.post('/api/analysis/rewrite', rewriteBullets);
app.get('/api/resumes/recent', getRecentAnalyses);
app.get('/api/resumes/:id', getAnalysisById);
app.post('/api/payments/order', createOrder);
app.post('/api/payments/verify', verifyPayment);
app.post('/api/templates/generate', generateTemplate);
app.post('/api/templates/image', generateTemplateImage);
app.get('/api/ops/r2/put-url', r2PutUrl);
app.get('/api/ops/r2/get-url', r2GetUrl);
app.post('/api/ops/queue/enqueue', enqueueJob);
app.get('/api/me', async (req, res) => {
  try {
    const uid = req.user?.uid || null;
    if (!uid) return res.json({ plan: 'free', planExpiresAt: null });
    const u = await User.findOne({ uid }).lean();
    res.json({ plan: u?.plan || 'free', planExpiresAt: u?.planExpiresAt || null });
  } catch { res.json({ plan: 'free', planExpiresAt: null }); }
});

const PORT = process.env.PORT || 5000;
await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/resuai');
app.listen(PORT, () => console.log(`[backend] listening on :${PORT}`));

if (process.env.SENTRY_DSN) {
  const errMw = (Sentry.Handlers && typeof Sentry.Handlers.errorHandler === 'function'
    ? Sentry.Handlers.errorHandler()
    : (typeof Sentry.errorHandler === 'function' ? Sentry.errorHandler() : null));
  if (errMw) app.use(errMw);
}

process.on('SIGINT', async () => { await mongoose.connection.close(); process.exit(0); });
