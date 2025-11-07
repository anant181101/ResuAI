export async function parseWithMicroservice(file) {
  const endpoint = process.env.RESUME_PARSER_URL || 'http://localhost:8081';
  const url = `${endpoint}/parse`;
  const form = new FormData();
  if (file) {
    const blob = new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' });
    form.append('resume', blob, file.originalname || 'resume');
  }
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Parser error ${res.status}`);
  return res.json();
}
