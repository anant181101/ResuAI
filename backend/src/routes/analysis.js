import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { parseWithMicroservice } from '../services/resumeParser.js';
import { getImprovements, getLinkedInBio } from '../services/ai.js';
import User from '../models/User.js';
import { computeReadabilityScore, computeImpactScore, computeFormatScore, computeKeywordsScore, clamp } from '../services/metrics.js';
import { semanticMatchScore } from '../services/embeddings.js';

export async function analyzeResume(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'resume file required' });
    const jd = (req.body?.jd || '').toString();
    const allowDev = process.env.ALLOW_DEV_FEATURES === 'true';
    if (jd) {
      const uid = req.user?.uid || null;
      let plan = 'free';
      if (uid) {
        const u = await User.findOneAndUpdate({ uid }, { $setOnInsert: { uid } }, { upsert: true, new: true });
        plan = u?.plan || 'free';
      }
      if (plan === 'free' && !allowDev) return res.status(402).json({ error: 'upgrade_required' });
    }
    const parsed = await parseWithMicroservice(file);
    const improvements = await getImprovements(parsed.extractedText || '', jd);
    // parse coverage heuristic
    let parseCoverage = 100;
    try {
      const fileBytes = file?.buffer?.length || 0;
      const textChars = (parsed.extractedText || '').length;
      if (fileBytes > 0) parseCoverage = clamp((textChars / fileBytes) * 100);
    } catch {}

    // breakdown
    const keywordsScore = computeKeywordsScore(parsed.matched || [], (parsed.keywords || []).length || 10);
    const readabilityScore = computeReadabilityScore(parsed.extractedText || '');
    const formatScore = computeFormatScore(parsed.extractedText || '');
    const impactScore = computeImpactScore(parsed.extractedText || '');
    const breakdown = { keywords: keywordsScore, readability: readabilityScore, format: formatScore, impact: impactScore };
    const score = clamp(0.4 * breakdown.keywords + 0.2 * breakdown.readability + 0.2 * breakdown.format + 0.2 * breakdown.impact);

    // JD match (simple keyword presence)
    let jdMatch = null;
    if (jd) {
      const jdLower = jd.toLowerCase();
      const uniqueJD = Array.from(new Set(jdLower.match(/[a-zA-Z+#.]{3,}/g) || []));
      // consider only terms that appear as tech/skill words
      const jdTerms = uniqueJD.filter(w => w.length >= 3);
      const resumeLower = (parsed.extractedText || '').toLowerCase();
      const present = jdTerms.filter(t => resumeLower.includes(t));
      const missingKeywords = jdTerms.filter(t => !resumeLower.includes(t)).slice(0, 20);
      const percent = clamp((present.length / Math.max(1, jdTerms.length)) * 100);
      let semanticPercent = null;
      try {
        const sim = await semanticMatchScore(parsed.extractedText || '', jd);
        semanticPercent = clamp(sim * 100);
      } catch {}
      jdMatch = { percent, missingKeywords, weakKeywords: [], semanticPercent };
    }

    const doc = await ResumeAnalysis.create({
      userId: req.user?.uid || null,
      resumeName: file.originalname,
      score,
      improvements,
      rawText: parsed.extractedText,
      keywords: parsed.keywords || [],
      matched: parsed.matched || [],
      missing: parsed.missing || [],
      parseCoverage,
      scoreBreakdown: breakdown,
      jdMatch,
    });
    res.json({ id: doc._id, score, improvements, keywords: doc.keywords, matched: doc.matched, missing: doc.missing, parseCoverage, scoreBreakdown: breakdown, jdMatch });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_analyze' });
  }
}

export async function rewriteBullets(req, res) {
  try {
    const allowDev = process.env.ALLOW_DEV_FEATURES === 'true';
    const uid = req.user?.uid || null;
    let plan = 'free';
    if (uid) {
      const u = await User.findOneAndUpdate({ uid }, { $setOnInsert: { uid } }, { upsert: true, new: true });
      plan = u?.plan || 'free';
    }
    if (plan === 'free' && !allowDev) return res.status(402).json({ error: 'upgrade_required' });
    const text = req.body?.text || '';
    const jd = (req.body?.jd || '').toString();
    if (!text) return res.status(400).json({ error: 'text_required' });
    const { getBulletRewrites } = await import('../services/ai.js');
    const items = await getBulletRewrites(text, jd);
    res.json({ items });
  } catch {
    res.status(500).json({ error: 'failed_to_rewrite' });
  }
}

export async function generateLinkedInBio(req, res) {
  try {
    const file = req.file;
    let text = req.body.text || '';
    if (file) {
      const parsed = await parseWithMicroservice(file);
      text = parsed.extractedText || '';
    }
    if (!text) return res.status(400).json({ error: 'text or resume required' });
    const bio = await getLinkedInBio(text);
    res.json({ linkedinBio: bio });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed_to_generate_bio' });
  }
}
