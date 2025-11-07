export function computeReadabilityScore(text = '') {
  // Very rough heuristic: penalize very long sentences and passive voice markers
  const sentences = text.split(/[.!?]+\s/).filter(Boolean);
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 50;
  const avgLen = words.length / Math.max(1, sentences.length);
  let score = 100;
  if (avgLen > 22) score -= Math.min(40, (avgLen - 22) * 2);
  const passiveHits = (text.match(/\b(is|was|were|be|been|being)\b\s+\w+ed\b/gi) || []).length;
  score -= Math.min(30, passiveHits * 3);
  return clamp(score);
}

export function computeImpactScore(text = '') {
  // Heuristic: action verbs, numbers/%, and toolnames increase impact
  const actionVerbs = ['led','managed','built','created','launched','optimized','designed','implemented','migrated','delivered','scaled','improved'];
  const tools = ['aws','gcp','azure','docker','kubernetes','react','node','python','go','sql','java','kafka'];
  const lower = text.toLowerCase();
  let score = 40;
  const verbHits = actionVerbs.filter(v => lower.includes(v)).length;
  score += Math.min(30, verbHits * 5);
  const numberHits = (lower.match(/\b(\d+|\d+%|million|billion|kpi|okr)\b/g) || []).length;
  score += Math.min(20, numberHits * 4);
  const toolHits = tools.filter(t => lower.includes(t)).length;
  score += Math.min(20, toolHits * 4);
  return clamp(score);
}

export function computeFormatScore(text = '') {
  // Heuristic ATS format checks: conventional headings and limited symbols
  let score = 100;
  const badSymbols = (text.match(/[•◆■▲◼︎▶︎☑︎✓✦✧☆★]/g) || []).length;
  score -= Math.min(25, badSymbols * 2);
  const hasWeirdHeadings = !/(work experience|experience|education|skills)/i.test(text);
  if (hasWeirdHeadings) score -= 20;
  return clamp(score);
}

export function computeKeywordsScore(matched = [], totalKeywords = 10) {
  const pct = (matched.length / Math.max(1, totalKeywords)) * 100;
  return clamp(pct);
}

export function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }
