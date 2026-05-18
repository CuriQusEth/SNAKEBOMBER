import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      name: "SnakeBomber Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "SnakeBomber",
      version: "1.0.0"
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      status: "success",
      message: "Agent action received",
      payload: req.body || {}
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
