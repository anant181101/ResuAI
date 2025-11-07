export const IMPROVEMENT_PROMPT = (resumeText) => `Analyze the following resume. Return 3-5 specific, actionable improvements, focusing on clarity, quantifiable impact, and ATS-friendly keywords. Resume:\n\n${resumeText}`;

export const LINKEDIN_BIO_PROMPT = (resumeText) => `Create a concise, first-person LinkedIn "About" summary (80-120 words) highlighting strengths, achievements, domain expertise, and a hint of personality. Resume:\n\n${resumeText}`;
