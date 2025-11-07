import { getPresignedPut, getPresignedGet, getPublicUrl } from '../lib/storage.js';
import { enqueue } from '../lib/queue.js';

export async function r2PutUrl(req, res) {
  try {
    const key = String(req.query.key || '').trim();
    const contentType = String(req.query.contentType || 'application/octet-stream');
    if (!key) return res.status(400).json({ error: 'key_required' });
    const r = await getPresignedPut(key, contentType);
    if (!r) return res.status(400).json({ error: 'r2_not_configured' });
    res.json(r);
  } catch { res.status(500).json({ error: 'failed' }); }
}

export async function r2GetUrl(req, res) {
  try {
    const key = String(req.query.key || '').trim();
    if (!key) return res.status(400).json({ error: 'key_required' });
    const pub = getPublicUrl(key);
    if (pub) return res.json({ url: pub, key });
    const r = await getPresignedGet(key);
    if (!r) return res.status(400).json({ error: 'r2_not_configured' });
    res.json(r);
  } catch { res.status(500).json({ error: 'failed' }); }
}

export async function enqueueJob(req, res) {
  try {
    const { queue, data, opts } = req.body || {};
    if (!queue) return res.status(400).json({ error: 'queue_required' });
    const job = await enqueue(queue, data || {}, opts || {});
    if (!job) return res.status(400).json({ error: 'queue_not_configured' });
    res.json({ id: job.id, name: job.name, queue });
  } catch { res.status(500).json({ error: 'failed' }); }
}
