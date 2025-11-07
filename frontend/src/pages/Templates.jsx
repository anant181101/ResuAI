import { useState } from 'react';
import api from '../services/api';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';

export default function Templates() {
  const [role, setRole] = useState('Software Engineer');
  const [experience, setExperience] = useState('mid');
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('');
  const [svg, setSvg] = useState('');
  const [imgBusy, setImgBusy] = useState(false);
  const [sections, setSections] = useState([
    { key: 'Header', enabled: true },
    { key: 'Summary', enabled: true },
    { key: 'Skills', enabled: true },
    { key: 'Experience', enabled: true },
    { key: 'Projects', enabled: true },
    { key: 'Education', enabled: true },
    { key: 'Certifications', enabled: true },
  ]);

  const parseTemplateSections = (txt) => {
    const names = sections.map(s=>s.key);
    const lines = (txt||'').split(/\n/);
    const out = [];
    let current = null;
    for (const ln of lines) {
      const h = names.find(n => ln.trim().toLowerCase() === n.toLowerCase());
      if (h) {
        if (current) out.push(current);
        current = { key: h, content: [] };
      } else if (current) {
        current.content.push(ln);
      }
    }
    if (current) out.push(current);
    return out.length ? out : [{ key: 'Body', content: lines }];
  };

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/templates/generate', { role, experience, style });
      setTemplate(data.template || '');
    } catch (err) {
      if (err?.response?.status === 402) return alert('Upgrade required to use AI Templates');
      alert('Failed to generate template');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setImgBusy(true);
    try {
      const { data } = await api.post('/templates/image', { role, experience, style, template });
      setSvg(data.svg || '');
    } catch (err) {
      if (err?.response?.status === 402) return alert('Upgrade required to generate images');
      alert('Failed to generate image');
    } finally {
      setImgBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(template); } catch {}
  };

  const downloadTxt = () => {
    const blob = new Blob([template], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${role.replace(/\s+/g,'_').toLowerCase()}_${experience}_${style}_template.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const svgToPngDataUrl = (svgText) => new Promise((resolve, reject) => {
    try {
      const svg64 = encodeURIComponent(svgText);
      const image64 = `data:image/svg+xml;charset=utf-8,${svg64}`;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 1240;
        const h = img.naturalHeight || 1754;
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL('image/png'), width: w, height: h });
      };
      img.onerror = reject;
      img.src = image64;
    } catch (e) { reject(e); }
  });

  const downloadPdf = async () => {
    if (!svg) return alert('Generate image first');
    try {
      const { dataUrl, width, height } = await svgToPngDataUrl(svg);
      const doc = new jsPDF({ unit: 'px', format: [width, height] });
      doc.addImage(dataUrl, 'PNG', 0, 0, width, height);
      doc.save(`${role.replace(/\s+/g,'_').toLowerCase()}_${experience}_${style}.pdf`);
    } catch { alert('Failed to export PDF'); }
  };

  const moveSection = (idx, dir) => {
    setSections(prev => {
      const arr = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return prev;
      const tmp = arr[idx];
      arr[idx] = arr[j];
      arr[j] = tmp;
      return arr;
    });
  };

  const toggleSection = (idx) => {
    setSections(prev => prev.map((s,i)=> i===idx ? ({...s, enabled: !s.enabled}) : s));
  };

  const downloadDocx = async () => {
    if (!template) return alert('Generate text first');
    const parsed = parseTemplateSections(template);
    const enabledKeys = sections.filter(s=>s.enabled).map(s=>s.key.toLowerCase());
    const order = sections.map(s=>s.key);
    const ordered = parsed.sort((a,b)=> order.indexOf(a.key) - order.indexOf(b.key));
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: ordered.flatMap(block => {
            if (!enabledKeys.includes(block.key.toLowerCase())) return [];
            const arr = [new Paragraph({ text: block.key, heading: HeadingLevel.HEADING_2 })];
            for (const line of block.content) {
              const t = line.trim();
              if (!t) { arr.push(new Paragraph('')); continue; }
              if (/^•|^-|^\*/.test(t)) {
                arr.push(new Paragraph({ children: [new TextRun(t.replace(/^[-*•]\s*/, ''))] }));
              } else {
                arr.push(new Paragraph({ children: [new TextRun(t)] }));
              }
            }
            return arr;
          })
        }
      ]
    });
    const blob = await Packer.toBlob(doc);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${role.replace(/\s+/g,'_').toLowerCase()}_${experience}_${style}.docx`;
    a.click();
  };

  return (
    <section className="container py-10 grid lg:grid-cols-3 gap-6">
      <div className="p-6 rounded-xl border bg-white">
        <h2 className="text-xl font-bold">AI Resume Template</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <input value={role} onChange={e=>setRole(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Experience</label>
            <select value={experience} onChange={e=>setExperience(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2">
              <option value="fresher">Fresher</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Style</label>
            <select value={style} onChange={e=>setStyle(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2">
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button disabled={loading} onClick={generate} className="rounded-md bg-primary text-white px-4 py-2 disabled:opacity-50">{loading?'Generating…':'Generate Text'}</button>
            <button disabled={imgBusy} onClick={generateImage} className="rounded-md border px-4 py-2 disabled:opacity-50">{imgBusy?'Generating…':'Generate Image'}</button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 p-6 rounded-xl border bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Preview</h3>
          <div className="flex gap-2">
            <button onClick={copy} className="rounded-md border px-3 py-2">Copy</button>
            <button onClick={downloadTxt} className="rounded-md bg-primary text-white px-3 py-2">Download .txt</button>
            <button onClick={downloadPdf} className="rounded-md bg-primary text-white px-3 py-2">Download PDF</button>
            <button onClick={downloadDocx} className="rounded-md bg-primary text-white px-3 py-2">Download DOCX</button>
          </div>
        </div>
        <div className="mt-3 grid gap-4">
          <textarea value={template} readOnly className="w-full h-48 border rounded-md p-3 font-mono text-sm whitespace-pre" />
          {svg && (
            <div className="border rounded-md overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          )}
        </div>
      </div>
      <div className="p-6 rounded-xl border bg-white lg:col-span-3">
        <h3 className="font-semibold">Sections</h3>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          {sections.map((s, i)=> (
            <div key={s.key} className="flex items-center justify-between rounded-md border px-3 py-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={s.enabled} onChange={()=>toggleSection(i)} />
                <span>{s.key}</span>
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={()=>moveSection(i,-1)} className="rounded-md border px-2 py-1">↑</button>
                <button type="button" onClick={()=>moveSection(i,1)} className="rounded-md border px-2 py-1">↓</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
