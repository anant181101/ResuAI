import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import api from '../services/api';

export default function UploadCard({ jd, onResult, onLoading }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const upload = async (f) => {
    const target = f || file;
    if (!target) return;
    setLoading(true);
    onLoading?.(true);
    try {
      const form = new FormData();
      form.append('resume', target);
      if (jd) form.append('jd', jd);
      const { data } = await api.post('/analysis/analyze', form);
      onResult?.(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 402) {
        alert('Upgrade required to use JD Match and advanced analysis');
        navigate('/pricing');
        return;
      }
      console.error('Analyze error', err?.response?.data || err?.message);
      const msg = err?.response?.data?.error || 'Failed to analyze resume';
      alert(msg);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    await upload();
  };

  return (
    <form onSubmit={handleUpload} className="p-6 rounded-xl border bg-white text-center">
      <div className="mx-auto w-full max-w-md">
        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer hover:bg-gray-50">
          <UploadCloud className="h-8 w-8 text-primary" />
          <span className="mt-3 text-gray-600">Drag & drop or click to upload (PDF/DOC/TXT)</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={async (e)=>{
              const f = e.target.files?.[0];
              setFile(f);
              if (f) await upload(f);
            }}
          />
        </label>
        {file && (
          <p className="mt-3 text-sm text-gray-600">Selected: <span className="font-medium">{file.name}</span></p>
        )}
        <button disabled={!file || loading} className="mt-6 w-full rounded-md bg-primary text-white px-4 py-2 disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>
    </form>
  );
}
