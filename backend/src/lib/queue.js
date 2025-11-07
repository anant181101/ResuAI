import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const caches = {
  redis: null,
  queues: new Map(),
};

function getPrefix() {
  return process.env.QUEUE_PREFIX || 'resuai';
}

export function getRedis() {
  if (caches.redis) return caches.redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  caches.redis = new Redis(url, { maxRetriesPerRequest: null, enableReadyCheck: true });
  return caches.redis;
}

export function getQueue(name) {
  const key = `${getPrefix()}:${name}`;
  if (caches.queues.has(key)) return caches.queues.get(key);
  const connection = getRedis();
  if (!connection) return null;
  const q = new Queue(name, {
    connection,
    prefix: getPrefix(),
    defaultJobOptions: { removeOnComplete: 500, removeOnFail: 1000, attempts: 1 },
  });
  caches.queues.set(key, q);
  return q;
}

export async function enqueue(name, data, opts = {}) {
  const q = getQueue(name);
  if (!q) return null;
  return q.add(opts.name || 'job', data, opts);
}

export function createWorker(name, processor, concurrency) {
  const connection = getRedis();
  if (!connection) return null;
  const worker = new Worker(name, processor, {
    connection,
    prefix: getPrefix(),
    concurrency: concurrency || Number(process.env.QUEUE_CONCURRENCY || 5),
    autorun: true,
  });
  return worker;
}
