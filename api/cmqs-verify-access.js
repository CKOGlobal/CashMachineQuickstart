// api/cmqs-verify-access.js
// The browser checks its stored access link here before showing paid pages.

import { verifyAccessToken } from './_lib/access.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const access = verifyAccessToken(req.body?.token || req.headers['x-cmqs-access']);
  if (!access) return res.status(401).json({ valid: false });
  return res.status(200).json({ valid: true, email: access.email, name: access.name, contactId: access.contactId });
}
