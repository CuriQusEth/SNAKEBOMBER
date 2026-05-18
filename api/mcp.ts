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
      protocol: "MCP",
      version: "1.0.0",
      name: "SnakeBomber MCP Endpoint",
      status: "active",
      description: "Active MCP server for SnakeBomber Orchestrator Agent",
      capabilities: [
        "snake-game-management", 
        "bombing-mechanics", 
        "reward-automation"
      ],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      
      let result = {};
      
      if (body.method === 'tools/list') {
        result = {
          tools: [
            { name: 'get_race_status', description: 'Get current race status [PLACEHOLDER]' },
            { name: 'start_race', description: 'Start a new race [PLACEHOLDER]' },
            { name: 'get_leaderboard', description: 'Get the leaderboard [PLACEHOLDER]' },
            { name: 'optimize_speed', description: 'Optimize speed [PLACEHOLDER]' },
            { name: 'get_track_info', description: 'Get track info [PLACEHOLDER]' }
          ]
        };
      } else if (body.method === 'tools/call') {
        result = { status: "Tool executed successfully [PLACEHOLDER]" };
      } else if (body.method === 'prompts/list') {
        result = { prompts: [] };
      } else if (body.method === 'resources/list') {
        result = { resources: [] };
      }

      return res.status(200).json({
        status: "success",
        message: "MCP command received",
        agent: "SnakeBomber Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body,
        result
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
