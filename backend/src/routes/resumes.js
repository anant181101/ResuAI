import ResumeAnalysis from '../models/ResumeAnalysis.js';

export async function getRecentAnalyses(_req, res) {
  const items = await ResumeAnalysis.find().sort({ createdAt: -1 }).limit(10).lean();
  res.json({ items });
}

export async function getAnalysisById(req, res) {
  try {
    const { id } = req.params;
    const item = await ResumeAnalysis.findById(id).lean();
    if (!item) return res.status(404).json({ error: 'not_found' });
    res.json({ item });
  } catch {
    res.status(400).json({ error: 'bad_request' });
  }
}
