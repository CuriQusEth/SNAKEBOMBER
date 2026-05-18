# Snake Bomber 🐍💣

> A high-octane, neon-infused hybrid of classic Snake and Bomberman, built with real on-chain mechanics.

## Overview
Eat food to grow. Drop bombs to destroy your enemies and clear paths. Survive as long as you can in the glowing neon grid! **Snake Bomber** is a fully mobile-optimized, high-performance web game utilizing HTML5 Canvas and Web3 technologies.

## Core Features & Tech Stack
- **Explosive Gameplay**: Classic Snake movement but you leave devastating time bombs.
- **Neon Art Style**: Futuristic cyberpunk vibes, custom Canvas rendering at 60fps.
- **Power-Ups**: Score multipliers, speed boosts, larger bomb blasts.
- **Web3 Integration**: Complete Wagmi + Viem integration.
- **SIWE Integration**: Score submission by crypto signature.
- **Tech Stack**: Next.js 14 (App Router Format), React, HTML-Canvas, Tailwind CSS.

## AI Agent Orchestrator (ERC-8004 & MCP)
This application includes the **SnakeBomber Orchestrator**, a platform-native AI Agent compatible with ERC-8004 standards. The agent autonomously handles:
- Multi-game management and operational logic
- Internal task orchestration
- Reward automation
- Daily operations

**Agent Capabilities listed in metadata:**
- `snake-game-management`
- `bombing-mechanics`
- `multi-game-management`
- `reward-automation`
- `daily-operations`
- `task-orchestration`
- `mcp-command-execution`

## MCP Connection Guide
The agent exposes a Model Context Protocol (MCP) server for dynamic command execution via Next.js App Router format routes:

1. **Agent Metadata/Registration Info**: Available at `/.well-known/agent-card.json` (Includes full EIP-8004 Registration profile).
2. **MCP API Endpoint**: Hosted natively at `/api/mcp` (GET/POST supported).
3. **Agent Action API**: Main API control exposed at `/api/agent`.

To connect standard AI tooling or CLI integrations to the MCP endpoint, post a JSON payload to `/api/mcp` defining the `method` (e.g. `tools/list` or `tools/call`). 

## How to Run Locally

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Visit the local endpoint (`http://localhost:3000`) to play the game and test the Web3 integration. To test orchestrator agent commands or verification routes locally, route API requests to `http://localhost:3000/api/mcp` and `http://localhost:3000/api/agent`.

Enjoy the boom. 💥
