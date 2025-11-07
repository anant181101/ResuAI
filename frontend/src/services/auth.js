import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let provider = null;
const isAuthEnabled = !!cfg.apiKey;

export function initFirebase() {
  if (app || !isAuthEnabled) return auth;
  app = initializeApp(cfg);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  return auth;
}

export async function signInWithGoogle() {
  initFirebase();
  if (!auth) throw new Error('Auth not configured');
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function signOutUser() {
  initFirebase();
  if (auth) await signOut(auth);
}

export function onAuth(cb) {
  initFirebase();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, cb);
}

export async function getIdToken() {
  initFirebase();
  if (!auth) return null;
  const u = auth.currentUser;
  return u ? await u.getIdToken() : null;
}
