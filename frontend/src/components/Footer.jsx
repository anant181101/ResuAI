import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-20">
      <div className="container grid md:grid-cols-4 gap-8 text-sm text-gray-600">
        <div>
          <div className="font-bold text-primary">ResuAI</div>
          <p className="mt-2">AI-powered resume analysis and templates.</p>
        </div>
        <div>
          <div className="font-semibold">Product</div>
          <div className="mt-2 grid gap-2">
            <Link to="/upload" className="hover:text-primary">Upload</Link>
            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
            <Link to="/templates" className="hover:text-primary">Templates</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <div className="mt-2 grid gap-2">
            <a href="https://github.com/anant181101/ResuAI" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </div>
        <div>
          <div className="font-semibold">Get in touch</div>
          <div className="mt-2 grid gap-2">
            <a href="https://github.com/anant181101/ResuAI/issues" target="_blank" rel="noreferrer" className="hover:text-primary">Open an issue</a>
          </div>
        </div>
      </div>
      <div className="container mt-8 text-xs text-gray-500 border-t pt-4"> {new Date().getFullYear()} ResuAI. All rights reserved.</div>
    </footer>
  );
}
