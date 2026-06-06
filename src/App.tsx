import { useState, useEffect } from 'react';
import { GameEngine } from './game/GameEngine';
import { GameCanvas } from './components/GameCanvas';
import { Controls } from './components/Controls';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSignMessage, useSendTransaction } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { generateAttributedTransaction } from './lib/erc8021';
import { Trophy, Wallet, Zap, Ghost, Skull, Sun } from 'lucide-react';

type ScreenState = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'LEADERBOARD' | 'GARAGE';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('TITLE');
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [score, setScore] = useState(0);
  const [activeSkin, setActiveSkin] = useState('#39FF14');
  
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { sendTransaction } = useSendTransaction();

  const startGame = () => {
    // 15x20 grid is good for portrait
    const newEngine = new GameEngine(15, 20);
    newEngine.state.snakeColor = activeSkin; // Support for custom skin
    newEngine.setCallbacks(
      (finalScore) => {
        setScore(finalScore);
        if(navigator.vibrate) navigator.vibrate([100, 50, 100]); // Game over feedback
        setScreen('GAME_OVER');
      },
      (currentScore) => {
        setScore(currentScore);
      }
    );
    setScore(0);
    setEngine(newEngine);
    setScreen('PLAYING');
  };

  const handleSignMessage = async () => {
    try {
      if (!isConnected || !address) {
        connect({ connector: connectors[0] });
        return;
      }
      
      const message = `SIWE: I scored ${score} in Snake Bomber! On Base. Attributed to builder code: bc_cy38d3l1`;
      const signature = await signMessageAsync({ account: address, message });
      alert(`Score submitted with signature! \n\n ${signature.substring(0, 20)}...`);
    } catch (error) {
      console.error(error);
      alert('Failed to sign message.');
    }
  };

  const sendGMTransaction = async () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
      return;
    }
    
    try {
      const data = encodeFunctionData({
        abi: [{ name: 'gm', type: 'function', inputs: [], outputs: [] }],
        functionName: 'gm'
      });
      
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: 0n,
        data,
      });
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  }

  return (
    <div className="relative w-full h-[100dvh] bg-[#0A0A0B] text-[#E4E4E7] flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#39FF14]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-[#FF007F]/5 blur-[100px] pointer-events-none" />

      {/* Screen Render */}
       <AnimatePresence mode="wait">
        
       {screen === 'GARAGE' && (
          <motion.div
            key="garage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10 w-full px-6 pt-12 h-screen"
          >
             <h2 className="text-2xl font-black text-[#E4E4E7] mb-2 tracking-widest uppercase flex items-center gap-3">
                <Zap className="text-[#00FFFF]" />
                Bomber Garage
             </h2>
             <p className="text-[10px] text-white/40 mb-8 uppercase tracking-widest font-mono">Unlock & Equip Skins</p>

             <div className="flex-1 w-full flex flex-col gap-4">
                {[
                  { name: 'Neon Toxic', color: '#39FF14', desc: 'Default classic green snake.' },
                  { name: 'Cyber Magenta', color: '#FF007F', desc: 'Hyper damage visualizer.' },
                  { name: 'Electric Cyan', color: '#00FFFF', desc: 'Speed demon aesthetic.' },
                  { name: 'Golden Sun', color: '#FFD700', desc: 'Exclusive VIP snake bomber.' }
                ].map(skin => (
                  <button 
                     key={skin.name}
                     onClick={() => setActiveSkin(skin.color)}
                     className={`w-full p-4 rounded border text-left flex items-center gap-4 transition-all ${activeSkin === skin.color ? 'border-white/50 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
                  >
                     <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: skin.color, boxShadow: `0 0 10px ${skin.color}` }} />
                     <div className="flex flex-col">
                        <span className="font-bold uppercase tracking-widest text-xs" style={{ color: skin.color }}>{skin.name}</span>
                        <span className="text-[10px] font-mono text-white/40">{skin.desc}</span>
                     </div>
                     {activeSkin === skin.color && <span className="ml-auto text-[10px] tracking-widest text-white/60 font-bold uppercase">EQUIPPED</span>}
                  </button>
                ))}
             </div>

             <div className="mt-8 pb-12 w-full">
               <button
                 onClick={() => setScreen('TITLE')}
                 className="w-full py-4 bg-white/5 border border-white/20 text-[#E4E4E7] text-xs font-bold rounded hover:bg-white/10 transition uppercase tracking-widest"
               >
                 Back to Menu
               </button>
             </div>
          </motion.div>
       )}

        {screen === 'TITLE' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10 w-full px-6"
          >
            <div className="relative mb-8">
              <h1 className="text-6xl font-black text-[#39FF14] uppercase tracking-widest text-center glow-text">
                SNAKE<br/>
                <span className="text-[#E4E4E7]">BOMBER</span>
              </h1>
            </div>

            <p className="text-white/40 text-[10px] tracking-[0.2em] font-mono text-center mb-12 max-w-sm">
              BASE MAINNET // ERC-8021 ACTIVATED
            </p>
            
            <button
              onClick={startGame}
              className="w-full max-w-sm py-4 bg-[#FF007F] text-white text-xs font-black uppercase tracking-widest rounded hover:bg-[#FF007F]/80 transition-colors shadow-[0_0_15px_rgba(255,0,127,0.5)] mb-4"
            >
              Start Bombing
            </button>

            <button
               onClick={() => setScreen('LEADERBOARD')}
               className="w-full max-w-sm py-4 bg-white/5 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mb-2"
            >
               <Trophy size={16} />
               Leaderboard
            </button>

            <button
               onClick={() => setScreen('GARAGE')}
               className="w-full max-w-sm py-4 bg-white/5 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mb-8"
            >
               <Zap size={16} />
               Bomber Garage (Skins)
            </button>

             {/* Connection & 8021 stuff */}
            <div className="p-4 border-neon bg-white/5 rounded flex flex-col items-center gap-3 w-full max-w-sm">
                {!isConnected ? (
                  <button 
                     onClick={() => connect({ connector: connectors[0] })}
                     className="flex items-center gap-2 text-[#39FF14] text-xs font-bold uppercase tracking-widest hover:text-[#39FF14]/80 transition-colors"
                  >
                     <Wallet size={16} /> Connect Wallet (Base)
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/40 font-mono text-sm">
                     <span className="flex items-center gap-2"><Wallet size={14}/> {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                     <button onClick={() => disconnect()} className="text-[#FF007F] text-[10px] uppercase tracking-widest hover:text-[#FF007F]/80">Disconnect</button>
                     
                     {isConnected && (
                       <button
                         onClick={sendGMTransaction}
                         className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
                       >
                         <Sun size={16} />
                         Say GM
                       </button>
                     )}
                  </div>
                )}
                <div className="h-px w-full bg-white/10 my-1" />
                <div className="text-[9px] text-white/20 font-mono text-center">
                  Verify with Base Builder Code: <br/>
                  <span className="text-white/40">bc_cy38d3l1</span>
                </div>
            </div>

          </motion.div>
        )}

        {screen === 'PLAYING' && engine && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col"
          >
            {/* Header HUD */}
            <div className="h-20 flex items-center justify-between px-6 bg-white/5 z-10 border-b border-white/10 w-full">
               <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Score</span>
                  <span className="text-xl font-black text-[#39FF14] font-mono">{score}</span>
               </div>
               <div className="flex gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Length</span>
                    <span className="text-lg font-bold text-[#E4E4E7] font-mono">{engine.state.snake.length}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Bombs</span>
                    <span className="text-lg font-bold text-[#FF007F] font-mono">{engine.state.maxBombs}</span>
                 </div>
               </div>
            </div>

            {/* Game Canvas Container */}
            <div className="flex-1 w-full overflow-hidden flex flex-col items-center justify-center relative p-4">
               <div className="border border-white/10 rounded overflow-hidden shadow-2xl shadow-[#39FF14]/5 relative">
                 <GameCanvas engine={engine} />
               </div>
            </div>

            {/* Controls */}
            <Controls engine={engine} />
          </motion.div>
        )}

        {screen === 'GAME_OVER' && (
          <motion.div
            key="game-over"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-10 w-full px-6"
          >
            <div className="w-20 h-20 bg-[#FF007F]/20 rounded flex items-center justify-center border border-[#FF007F] mb-6 shadow-[0_0_15px_#FF007F]">
               <Skull className="text-[#FF007F]" size={36} />
            </div>
            <h2 className="text-4xl font-black text-[#E4E4E7] mb-2 tracking-widest uppercase">GAME OVER</h2>
            <p className="text-white/40 mb-8 font-mono text-sm tracking-widest">FINAL SCORE: <span className="text-xl text-[#39FF14]">{score}</span></p>
            
            <button
               onClick={handleSignMessage}
               className="w-full max-w-sm py-4 bg-[#FF007F] text-white text-xs font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 mb-4 hover:bg-[#FF007F]/80 transition-colors shadow-[0_0_15px_rgba(255,0,127,0.5)]"
            >
               <Trophy size={16} />
               Submit Score On-Chain
            </button>

            <button
               onClick={startGame}
               className="w-full max-w-sm py-4 bg-white/5 border border-white/20 text-[#39FF14] font-bold text-xs uppercase tracking-widest rounded mb-8 hover:bg-white/10 transition-colors"
            >
               Play Again
            </button>
            <button
               onClick={() => setScreen('TITLE')}
               className="text-white/40 font-mono text-[10px] uppercase tracking-widest hover:text-white transition-colors pb-8"
            >
               Return to Title
            </button>
          </motion.div>
        )}

        {screen === 'LEADERBOARD' && (
           <motion.div
             key="leaderboard"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="flex flex-col w-full h-[100dvh] pt-12 px-6"
           >
             <h2 className="text-2xl font-black text-[#E4E4E7] mb-2 tracking-widest uppercase flex items-center gap-3">
                <Trophy className="text-[#39FF14]" />
                Global Rankings
             </h2>
             <p className="text-[10px] text-white/40 mb-8 uppercase tracking-widest font-mono">Hybrid On-chain Leaderboard</p>

             <div className="flex-1 overflow-y-auto space-y-3 pb-24">
                {/* Mock leaderboard */}
                {[
                  { addr: '0x12..34A', score: 14250, trust: 'High' },
                  { addr: '0xB0..11F', score: 9800, trust: 'High' },
                  { addr: '0xF3..42B', score: 6540, trust: 'Medium' },
                  { addr: '0x99..D2A', score: 4100, trust: 'Low' },
                  { addr: '0xAA..BB3', score: 2300, trust: 'High' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <span className={`font-mono font-bold text-xs ${i === 0 ? 'text-[#39FF14]' : i === 1 ? 'text-[#39FF14]/80' : i === 2 ? 'text-[#39FF14]/60' : 'text-white/40'}`}>{(i+1).toString().padStart(2, '0')}</span>
                       <div className="w-6 h-6 bg-gradient-to-tr from-[#39FF14]/20 to-[#FF007F]/20 rounded-full"></div>
                       <div className="flex flex-col">
                         <span className="font-mono text-[#E4E4E7] text-xs">{item.addr}</span>
                         <span className="text-[9px] text-white/40 flex items-center gap-1 font-mono tracking-widest">
                            <Ghost size={10} /> TRUST: <span className={item.trust === 'High' ? 'text-[#39FF14]' : 'text-yellow-500'}>{item.trust.toUpperCase()}</span>
                         </span>
                       </div>
                    </div>
                    <span className="font-mono font-black text-[#39FF14]">{item.score.toLocaleString()}</span>
                  </div>
                ))}
             </div>

             <div className="absolute bottom-6 left-6 right-6">
               <button
                 onClick={() => setScreen('TITLE')}
                 className="w-full max-w-sm mx-auto flex py-4 bg-white/5 border border-white/20 text-[#E4E4E7] text-xs font-bold rounded hover:bg-white/10 transition uppercase tracking-widest items-center justify-center"
               >
                 Back
               </button>
             </div>
           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
