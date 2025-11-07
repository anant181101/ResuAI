import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bot, Upload as UploadIcon, LayoutDashboard } from 'lucide-react';
import { onAuth, signOutUser } from '../services/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  useEffect(() => onAuth(setUser), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary">
          <Bot className="h-6 w-6" /> ResuAI
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/pricing" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Pricing</NavLink>
          <NavLink to="/templates" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Templates</NavLink>
          <NavLink to="/dashboard" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}><LayoutDashboard className="inline h-4 w-4 mr-1"/>Dashboard</NavLink>
          <Link to="/upload" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white shadow hover:brightness-110">
            <UploadIcon className="h-4 w-4 mr-2"/> Upload
          </Link>
          {!user ? (
            <Link to="/login" className="rounded-md px-4 py-2 border hover:bg-gray-50">Login</Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </div>
              <button onClick={async ()=>{ await signOutUser(); }} className="rounded-md px-3 py-2 border hover:bg-gray-50">Sign out</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
