import { getResumeTemplate, getResumeTemplateSVG } from '../services/ai.js';
import User from '../models/User.js';

export async function generateTemplate(req, res) {
  try {
    const allowDev = process.env.ALLOW_DEV_FEATURES === 'true';
    const uid = req.user?.uid || null;
    let plan = 'free';
    if (uid) {
      const u = await User.findOneAndUpdate({ uid }, { $setOnInsert: { uid } }, { upsert: true, new: true });
      plan = u?.plan || 'free';
    }
    if (plan === 'free' && !allowDev) return res.status(402).json({ error: 'upgrade_required' });
    const { role, experience, style } = req.body || {};
    const template = await getResumeTemplate({ role, experience, style });
    res.json({ template });
  } catch {
    res.status(500).json({ error: 'failed_to_generate_template' });
  }
}

export async function generateTemplateImage(req, res) {
  try {
    const allowDev = process.env.ALLOW_DEV_FEATURES === 'true';
    const uid = req.user?.uid || null;
    let plan = 'free';
    if (uid) {
      const u = await User.findOneAndUpdate({ uid }, { $setOnInsert: { uid } }, { upsert: true, new: true });
      plan = u?.plan || 'free';
    }
    if (plan === 'free' && !allowDev) return res.status(402).json({ error: 'upgrade_required' });
    const { role, experience, style, template } = req.body || {};
    const svg = await getResumeTemplateSVG({ role, experience, style, template });
    res.json({ svg });
  } catch {
    res.status(500).json({ error: 'failed_to_generate_template_image' });
  }
}
