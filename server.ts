import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Agent API
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "SnakeBomber Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "SnakeBomber",
      version: "1.0.0"
    });
  });

  // CORS Headers Helper
  const setCors = (res: express.Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  };

  app.options('/api/mcp', (req, res) => {
    setCors(res);
    res.status(204).end();
  });

  // MCP API
  app.get("/api/mcp", (req, res) => {
    setCors(res);
    res.json({
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
  });

  app.post("/api/mcp", (req, res) => {
    setCors(res);
    try {
      const body = req.body;
      
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

      res.json({
        status: "success",
        message: "MCP command received",
        agent: "SnakeBomber Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body,
        result
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
