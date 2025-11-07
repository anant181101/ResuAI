import OpenAI from 'openai';
import axios from 'axios';

const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

let openaiClient = null;
if (openaiKey) openaiClient = new OpenAI({ apiKey: openaiKey });

function hashEmbed(text, dim = 256) {
  const v = new Array(dim).fill(0);
  const words = (text || '').toLowerCase().match(/[a-z0-9+#.]{2,}/g) || [];
  for (const w of words) {
    let h = 0;
    for (let i = 0; i < w.length; i++) h = (h * 31 + w.charCodeAt(i)) >>> 0;
    v[h % dim] += 1;
  }
  const norm = Math.sqrt(v.reduce((a, b) => a + b * b, 0)) || 1;
  return v.map(x => x / norm);
}

export async function embedText(text) {
  try {
    if (openaiClient) {
      const r = await openaiClient.embeddings.create({ model: 'text-embedding-3-small', input: text });
      return r.data[0].embedding;
    }
    if (geminiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`;
      const body = { content: { parts: [{ text }] } };
      const { data } = await axios.post(url, body, { timeout: 20000 });
      const vec = data?.embedding?.values || data?.data?.[0]?.embedding || [];
      if (Array.isArray(vec) && vec.length) return vec;
    }
  } catch {}
  return hashEmbed(text);
}

export async function embedMany(texts) {
  const out = [];
  for (const t of texts) out.push(await embedText(t));
  return out;
}

export function cosineSimilarity(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

export async function semanticMatchScore(aText, bText) {
  const [a, b] = await Promise.all([embedText(aText), embedText(bText)]);
  return cosineSimilarity(a, b);
}
