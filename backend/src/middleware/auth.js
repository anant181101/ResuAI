import { initFirebaseAdmin } from '../lib/firebase.js';

const app = initFirebaseAdmin();

export async function authOptional(req, _res, next) {
  try {
    if (!app) return next(); // Auth not configured; continue
    const h = req.headers.authorization || '';
    const m = h.match(/^Bearer\s+(.+)$/i);
    if (!m) return next();
    const token = m[1];
    const decoded = await (await import('firebase-admin')).then(({ default: admin }) => admin.auth().verifyIdToken(token));
    req.user = { uid: decoded.uid, email: decoded.email };
  } catch {
    // ignore invalid tokens in optional mode
  }
  next();
}
