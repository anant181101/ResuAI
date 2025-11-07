import OpenAI from 'openai';
import axios from 'axios';

const openaiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const geminiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

let openaiClient = null;
if (openaiKey) {
  openaiClient = new OpenAI({ apiKey: openaiKey });
}

function stripCodeFences(txt) {
  if (!txt) return txt;
  return txt.replace(/^```[a-zA-Z]*\n?/,'').replace(/```\s*$/,'').trim();
}

export async function getResumeTemplateSVG(input) {
  const role = input?.role || 'Software Engineer';
  const experience = input?.experience || 'mid';
  const style = input?.style || 'modern';
  const template = input?.template || '';
  const prompt = `Create a single inline SVG image to visually represent a clean ${style} resume template for a ${experience}-level ${role}. Use size 1240x1754 (A4 at ~150dpi). White background. Black text. Minimal separators (lines/rects). Include sections: Header (name, title, contacts), Summary, Skills, Experience (two roles with bullets), Projects, Education. Keep text as placeholders (do not include personal data). Output raw SVG only, no markdown fences.${template ? `\n\nUse this textual template as guidance:\n${template}` : ''}`;
  try {
    if (openaiClient) {
      const chat = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });
      const content = chat.choices?.[0]?.message?.content || '';
      return stripCodeFences(content);
    }
    const g = await callGemini(prompt, 0.3);
    if (g) return stripCodeFences(g);
  } catch {}
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754"><rect width="100%" height="100%" fill="#fff"/><text x="80" y="120" font-size="36" font-family="Arial" fill="#000">Name Lastname | Title</text><text x="80" y="170" font-size="16" font-family="Arial" fill="#000">email@domain.com | +91-XXXXXXXXXX | City, IN</text><line x1="80" y1="200" x2="1160" y2="200" stroke="#000" stroke-width="1"/><text x="80" y="240" font-size="20" font-family="Arial" fill="#000">Summary</text><text x="80" y="270" font-size="14" font-family="Arial" fill="#000">• Role-aligned professional with X years...</text><text x="80" y="300" font-size="14" font-family="Arial" fill="#000">• Strengths in tools and outcomes...</text><text x="80" y="360" font-size="20" font-family="Arial" fill="#000">Skills</text><text x="80" y="390" font-size="14" font-family="Arial" fill="#000">• JavaScript • React • Node • AWS • CI/CD</text><text x="80" y="450" font-size="20" font-family="Arial" fill="#000">Experience</text><text x="80" y="480" font-size="16" font-family="Arial" fill="#000">Role | Company | YYYY–YYYY</text><text x="80" y="505" font-size="14" font-family="Arial" fill="#000">• Drove metric +X% by Y using Z</text><text x="80" y="530" font-size="14" font-family="Arial" fill="#000">• Reduced cost by X% via A/B</text><text x="80" y="585" font-size="16" font-family="Arial" fill="#000">Role | Company | YYYY–YYYY</text><text x="80" y="610" font-size="14" font-family="Arial" fill="#000">• Built feature used by N users</text><text x="80" y="635" font-size="14" font-family="Arial" fill="#000">• Automated pipeline cutting release time</text><text x="80" y="700" font-size="20" font-family="Arial" fill="#000">Projects</text><text x="80" y="730" font-size="14" font-family="Arial" fill="#000">Project Name | Tech: A, B</text><text x="80" y="755" font-size="14" font-family="Arial" fill="#000">• Solved problem P, achieved R</text><text x="80" y="820" font-size="20" font-family="Arial" fill="#000">Education</text><text x="80" y="850" font-size="14" font-family="Arial" fill="#000">Degree, University | YYYY</text></svg>`;
}

async function callGemini(prompt, temperature = 0.5) {
  if (!geminiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }]}],
    generationConfig: { temperature },
  };
  const { data } = await axios.post(url, body, { timeout: 20000 });
  const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof txt === 'string' ? txt.trim() : null;
}

export async function getImprovements(resumeText, jdText = '') {
  const jdPart = jdText ? `\n\nJob Description:\n${jdText}\n\nEnsure at least one bullet directly aligns missing keywords or phrasing to this JD.` : '';
  const prompt = `You are a 2025 resume reviewer for tech roles. Analyze the resume text and produce 3–5 specific, high-impact, actionable bullets. Each bullet should state the issue and a concrete fix (include example wording if useful). Prioritize quantified outcomes, strong verbs, JD/ATS keyword alignment, and modern formatting (sections, consistency, brevity). Output plain bullets only, no numbering or extra text.\n\nResume:\n${resumeText}${jdPart}`;
  try {
    if (openaiClient) {
      const chat = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
      });
      const content = chat.choices?.[0]?.message?.content || '';
      return content.split(/\n+/).map(s=>s.replace(/^[-*]\s*/, '')).filter(Boolean).slice(0,5);
    }
    const g = await callGemini(prompt, 0.4);
    if (g) return g.split(/\n+/).map(s=>s.replace(/^[-*]\s*/, '')).filter(Boolean).slice(0,5);
  } catch { /* fall through */ }
  return [
    'Add quantifiable achievements (numbers, % impact).',
    'Include role-specific keywords from the job description.',
    'Ensure consistent formatting and section headings.',
  ];
}

export async function getLinkedInBio(resumeText) {
  const prompt = `Create a concise, first-person LinkedIn About section (80-120 words) highlighting strengths, quantified achievements, domain expertise, and tools. Keep it professional and warm.\n\nResume:\n${resumeText}`;
  try {
    if (openaiClient) {
      const chat = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
      });
      return chat.choices?.[0]?.message?.content?.trim();
    }
    const g = await callGemini(prompt, 0.6);
    if (g) return g;
  } catch { /* fall through */ }
  return 'Experienced professional with a focus on measurable outcomes and cross-functional collaboration.';
}

export async function getResumeTemplate(input) {
  const role = input?.role || 'Software Engineer';
  const experience = input?.experience || 'mid';
  const style = input?.style || 'modern';
  const prompt = `Design a clean ${style} resume template for a ${experience}-level ${role}. Return a concise text layout with clear section titles and example placeholders, optimized for ATS and readability. Include sections: Header (name, title, contacts), Summary (3 lines), Skills (bulleted), Experience (2-3 roles, each with role, company, dates, 3 quantified bullets), Projects (2 entries with impact), Education, Certifications (if any). Use consistent bullet symbols and short lines. Do not include markdown fences.`;
  try {
    if (openaiClient) {
      const chat = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      });
      const content = chat.choices?.[0]?.message?.content || '';
      return content.trim();
    }
    const g = await callGemini(prompt, 0.5);
    if (g) return g;
  } catch {}
  return `Name Lastname | Title\nemail@domain.com | +91-XXXXXXXXXX | City, IN | linkedin.com/in/username | github.com/user\n\nSummary\n• Role-aligned professional with X years in ${role}, delivering outcomes in A, B, C.\n• Strengths in tools T1, T2, T3; known for ownership and collaboration.\n• Seeking to drive impact in ${style} teams focusing on D and E.\n\nSkills\n• Languages: JavaScript, TypeScript, Go\n• Frameworks: React, Node.js, Express\n• Cloud/Tools: AWS, Docker, CI/CD\n\nExperience\nRole | Company | YYYY–YYYY | City\n• Drove metric +X% by implementing Y using Z.\n• Reduced cost by X% via A/B.\n• Led cross-functional effort across N stakeholders.\n\nRole | Company | YYYY–YYYY | City\n• Built feature used by N users with uptime >99.9%.\n• Automated pipeline cutting release time by X%.\n• Mentored juniors improving team velocity.\n\nProjects\nProject Name | Tech: A, B\n• Solved problem P, achieving result R.\n\nEducation\nDegree, University | YYYY\n\nCertifications\n• Certification Name`; 
}

export async function getBulletRewrites(text, jdText = '') {
  const prompt = `Rewrite the following resume bullets to be stronger. Return a JSON array where each item has {"before": string, "after": string, "category": one of ["quantify","action_verb","clarity","keyword","format"]}. Focus on strong verbs, quantified outcomes, concise phrasing, and alignment to the JD if provided. Use short lines.\n\nBullets:\n${text}\n${jdText ? `\nJob Description:\n${jdText}` : ''}`;
  try {
    if (openaiClient) {
      const chat = await openaiClient.chat.completions.create({
        model: openaiModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });
      const content = chat.choices?.[0]?.message?.content || '[]';
      let arr;
      try { arr = JSON.parse(content); } catch { arr = []; }
      arr = Array.isArray(arr) ? arr : arr.items || [];
      return Array.isArray(arr) ? arr.slice(0, 10) : [];
    }
    const g = await callGemini(prompt, 0.4);
    if (g) {
      const s = g.trim();
      const j = s.startsWith('[') ? s : s.replace(/^[^{[]+/, '');
      try {
        const arr = JSON.parse(j);
        return Array.isArray(arr) ? arr.slice(0, 10) : [];
      } catch {}
    }
  } catch {}
  const lines = (text || '').split(/\n+/).map(s=>s.trim()).filter(Boolean).slice(0,10);
  return lines.map(l=>{
    let after = l.replace(/^Responsible for\s*/i,'Led ').replace(/^Worked on\s*/i,'Built ');
    if (!/(\d+%|\d+|\d+\.\d+)/.test(after)) after = after + ' resulting in +X% improvement';
    return { before: l, after, category: /led|built/i.test(after) ? 'action_verb' : 'quantify' };
  });
}
