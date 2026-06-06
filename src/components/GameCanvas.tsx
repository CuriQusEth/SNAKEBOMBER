import { useEffect, useRef, useState } from 'react';
import { GameEngine, GameState, CellType, CELL_SIZE } from '../game/GameEngine';

interface GameCanvasProps {
  engine: GameEngine;
}

export function GameCanvas({ engine }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();

    const draw = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      engine.update(deltaTime);
      const state = engine.state;

      // Clear canvas
      ctx.fillStyle = '#0A0A0B'; // Zinc-replacement
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      for (let x = 0; x < state.gridWidth; x++) {
        for (let y = 0; y < state.gridHeight; y++) {
          const cell = state.grid[x][y];
          if (cell === CellType.WALL) {
            ctx.fillStyle = '#1F2937'; 
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            // Neon accent
            ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          } else if (cell === CellType.DESTRUCTIBLE_WALL) {
            ctx.fillStyle = 'rgba(255, 0, 127, 0.1)'; 
            ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.strokeStyle = '#FF007F'; 
            ctx.lineWidth = 1;
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          } else {
             // Subtle grid
             ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)'; 
             ctx.lineWidth = 1;
             ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          }
        }
      }

      // Draw apples
      ctx.fillStyle = '#FFD700';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#FFD700';
      state.apples.forEach(apple => {
        ctx.beginPath();
        ctx.arc(apple.x * CELL_SIZE + CELL_SIZE / 2, apple.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Draw PowerUps
      state.powerUps.forEach(pu => {
         ctx.fillStyle = pu.type === 'BOMB_UP' ? '#FF007F' : pu.type === 'RANGE_UP' ? '#9333EA' : '#FFD700';
         ctx.shadowBlur = 15;
         ctx.shadowColor = ctx.fillStyle;
         ctx.fillRect(pu.x * CELL_SIZE + 4, pu.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
         ctx.shadowBlur = 0;
      });

      // Draw Bombs
      state.bombs.forEach(bomb => {
        const pulse = Math.abs(Math.sin((2000 - bomb.timer) / 100));
        ctx.fillStyle = '#FF007F';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF007F';
        ctx.beginPath();
        ctx.arc(bomb.x * CELL_SIZE + CELL_SIZE / 2, bomb.y * CELL_SIZE + CELL_SIZE / 2, (CELL_SIZE / 2.2) * (0.8 + 0.2 * pulse), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.ceil(bomb.timer / 1000).toString(), bomb.x * CELL_SIZE + CELL_SIZE / 2, bomb.y * CELL_SIZE + CELL_SIZE / 2);
      });

      // Draw Explosions
      state.explosions.forEach(exp => {
        const intensity = exp.life / exp.maxLife;
        ctx.fillStyle = `rgba(255, 0, 127, ${intensity})`; 
        ctx.shadowBlur = 20 * intensity;
        ctx.shadowColor = '#FF007F';
        ctx.fillRect(exp.x * CELL_SIZE, exp.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        // Inner white core
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
        ctx.fillRect(exp.x * CELL_SIZE + 4, exp.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
        ctx.shadowBlur = 0;
      });

      // Draw Snake
      ctx.shadowBlur = 10;
      state.snake.forEach((segment, i) => {
        ctx.fillStyle = state.snakeColor || '#39FF14'; 
        ctx.shadowColor = state.snakeColor || '#39FF14';
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [engine]);

  return (
    <canvas
      ref={canvasRef}
      width={engine.state.gridWidth * CELL_SIZE}
      height={engine.state.gridHeight * CELL_SIZE}
      className="max-w-full max-h-full object-contain mx-auto"
      style={{ touchAction: 'none' }}
    />
  );
}
