# Snake Bomber 🐍💣

> A high-octane, neon-infused hybrid of classic Snake and Bomberman, built with real on-chain mechanics for Base Mainnet.

## Overview
Eat food to grow. Drop bombs to destroy your enemies and clear paths. Survive as long as you can in the glowing neon grid!

## AI Agent Orchestrator (ERC-8004 & MCP)
This application includes the **SnakeBomber Orchestrator** AI Agent, compatible with ERC-8004. The agent handles:
- Multi-game management and operational logic
- Internal task orchestration
- MCP (Model Context Protocol) integration for dynamic commands

Agent details and endpoints are publicly accessible via standard web APIs:
- **Agent Card**: `/.well-known/agent-card.json`
- **MCP API**: `/api/mcp`
- **Agent Action API**: `/api/agent`

## Core Features
- **Explosive Gameplay**: Classic Snake movement but you leave devastating time bombs.
- **Neon Art Style**: Futuristic cyberpunk vibes, custom HTML5 Canvas rendering.
- **Power-Ups**: Score multipliers, speed boosts, larger bomb blasts.
- **On-Chain Ready (Base Mainnet)**: Complete Wagmi + Viem integration.
- **ERC-8021 Transaction Attribution**: Builder attribution baked in.
- **ERC-8004 Trustless Agents**: Active orchestrator tracking via native API routes.
- **SIWE Integration**: Score submission by crypto signature.

## Base Specific Meta tag
Verified with Base App ID:
`<meta name="base:app_id" content="68e67f3bfa56531ddaa2ec46" />`

## Builder Information
**Transaction Attribution Code (ERC-8021)**: `bc_cy38d3l1`

Developed utilizing Vite + React + Express for extreme performance, AI orchestration, and rapid Base prototyping.

Enjoy the boom. 💥
