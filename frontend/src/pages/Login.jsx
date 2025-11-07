import { useEffect, useState } from 'react';
import { onAuth, signInWithGoogle, signOutUser } from '../services/auth';

export default function Login() {
  const [user, setUser] = useState(null);
  useEffect(() => onAuth(setUser), []);

  const handleLogin = async () => {
    try { await signInWithGoogle(); } catch (e) { alert(e.message || 'Login failed'); }
  };
  const handleLogout = async () => { await signOutUser(); };

  return (
    <section className="container py-10 max-w-md">
      <h2 className="text-2xl font-bold">{user ? 'Account' : 'Login'}</h2>
      {!user ? (
        <>
          <p className="mt-2 text-gray-600">Sign in with Google to sync your dashboard across devices.</p>
          <button onClick={handleLogin} className="mt-6 w-full rounded-md bg-primary text-white px-4 py-2">Sign in with Google</button>
        </>
      ) : (
        <div className="mt-4 p-4 border rounded-md bg-white">
          <p className="font-medium">{user.displayName || user.email}</p>
          <p className="text-sm text-gray-600">UID: {user.uid}</p>
          <button onClick={handleLogout} className="mt-4 rounded-md border px-4 py-2 hover:bg-gray-50">Sign out</button>
        </div>
      )}
    </section>
  );
}
