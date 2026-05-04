import { useEffect } from 'react';
import { GameEngine } from '../game/GameEngine';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Bomb } from 'lucide-react';

interface ControlsProps {
  engine: GameEngine | null;
}

export function Controls({ engine }: ControlsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engine) return;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          engine.setDirection(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          engine.setDirection(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          engine.setDirection(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          engine.setDirection(1, 0);
          break;
        case ' ':
          engine.dropBomb();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  if (!engine) return null;

  return (
    <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-between items-end pointer-events-none">
      {/* Move Controls */}
      <div className="grid grid-cols-3 gap-2 pointer-events-auto">
        <div />
        <button
          className="w-14 h-14 bg-white/5 border border-white/10 rounded flex items-center justify-center active:bg-white/10 active:scale-95 transition-all text-white/40 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          onClick={() => engine.setDirection(0, -1)}
          aria-label="Up"
        >
          <ArrowUp size={32} />
        </button>
        <div />
        <button
          className="w-14 h-14 bg-white/5 border border-white/10 rounded flex items-center justify-center active:bg-white/10 active:scale-95 transition-all text-white/40 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          onClick={() => engine.setDirection(-1, 0)}
          aria-label="Left"
        >
          <ArrowLeft size={32} />
        </button>
        <button
          className="w-14 h-14 bg-white/5 border border-white/10 rounded flex items-center justify-center active:bg-white/10 active:scale-95 transition-all text-white/40 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          onClick={() => engine.setDirection(0, 1)}
          aria-label="Down"
        >
          <ArrowDown size={32} />
        </button>
        <button
          className="w-14 h-14 bg-white/5 border border-white/10 rounded flex items-center justify-center active:bg-white/10 active:scale-95 transition-all text-white/40 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          onClick={() => engine.setDirection(1, 0)}
          aria-label="Right"
        >
          <ArrowRight size={32} />
        </button>
      </div>

      {/* Action Controls */}
      <div className="pointer-events-auto">
        <button
          className="w-20 h-20 bg-[#FF007F]/20 rounded flex items-center justify-center active:bg-[#FF007F]/40 active:scale-90 transition-all text-[#FF007F] shadow-[0_0_20px_rgba(255,0,127,0.4)] border border-[#FF007F]"
          onClick={() => {
              if(navigator.vibrate) navigator.vibrate(50);
              engine.dropBomb();
          }}
        >
          <Bomb size={36} />
        </button>
      </div>
    </div>
  );
}
