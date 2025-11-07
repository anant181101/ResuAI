import 'dotenv/config';
import * as Sentry from '@sentry/node';
import { createWorker } from './lib/queue.js';

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
}

function getProcessor() {
  return async (job) => {
    try {
      if (job.name === 'job') {
        if (process.env.WORKER_LOG === 'true') {
          console.log(`[worker] ${job.queueName}#${job.id}`, job.data);
        }
        return { ok: true };
      }
      return { ok: true };
    } catch (err) {
      Sentry.captureException?.(err);
      throw err;
    }
  };
}

const queues = (process.env.WORKER_QUEUES || 'default').split(',').map(s=>s.trim()).filter(Boolean);
if (!queues.length) queues.push('default');

for (const q of queues) {
  const worker = createWorker(q, getProcessor());
  if (!worker) {
    console.error('[worker] redis not configured, cannot start');
    process.exit(1);
  }
  worker.on('failed', (job, err) => {
    Sentry.captureException?.(err);
    if (process.env.WORKER_LOG === 'true') console.error(`[worker] failed ${q}#${job.id}`, err?.message);
  });
  worker.on('completed', (job) => {
    if (process.env.WORKER_LOG === 'true') console.log(`[worker] completed ${q}#${job.id}`);
  });
}

process.on('SIGINT', () => process.exit(0));
