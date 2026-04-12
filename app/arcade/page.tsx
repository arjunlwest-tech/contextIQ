"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { loadState, saveState, unlockLevel, getLevel, getLevelTitle } from '@/lib/arcade-store';

// Dynamic imports for 3D components to avoid SSR issues
const VantageRun = dynamic(() => import('@/components/arcade/VantageRun'), { ssr: false });
const NebulaSort = dynamic(() => import('@/components/arcade/NebulaSort'), { ssr: false });
const StellarStriker = dynamic(() => import('@/components/arcade/StellarStriker'), { ssr: false });
const GravityMatch = dynamic(() => import('@/components/arcade/GravityMatch'), { ssr: false });
const VoidClimb = dynamic(() => import('@/components/arcade/VoidClimb'), { ssr: false });

const STARTER_SET = {
  id: 'starter_set',
  name: 'Vantage Academy Core',
  description: 'General knowledge booster.',
  quizQuestions: [
    { id: 'q1', type: 'mcq', question: 'What is the powerhouse of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi'], correct: 'Mitochondria' },
    { id: 'q2', type: 'mcq', question: 'Speed of light is approximately...', options: ['300k km/s', '150k km/s', '1M km/s', '500k km/s'], correct: '300k km/s' }
  ],
  flashcards: [
    { id: 'fc1', front: 'H2O', back: 'Water' },
    { id: 'fc2', front: 'Au', back: 'Gold' }
  ]
};

const ARCHETYPES = [
  { id: 'runner', name: 'Vantage Run', icon: '🏃', color: '#6366f1' },
  { id: 'shooter', name: 'Stellar Striker', icon: '🚀', color: '#10b981' },
  { id: 'match', name: 'Gravity Match', icon: '🧩', color: '#ec4899' },
  { id: 'tower', name: 'Void Climb', icon: '🏙️', color: '#f59e0b' },
  { id: 'sort', name: 'Nebula Sort', icon: '⚛️', color: '#22d3ee' },
];

export default function ArcadePage() {
  const [state, setState] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [selectedSet, setSelectedSet] = useState(STARTER_SET);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) return <div className="min-h-screen bg-black flex items-center justify-center text-white">INITIALIZING VANTAGE ENGINE...</div>;

  const LEVELS = Array.from({ length: 50 }, (_, i) => {
    const archIdx = Math.floor(i / 10);
    const subIdx = (i % 10) + 1;
    const arch = ARCHETYPES[archIdx];
    return {
      id: `game_${i}`,
      archetypeId: arch.id,
      name: `${arch.name} — Phase ${subIdx}`,
      difficulty: subIdx,
      icon: arch.icon,
      color: arch.color,
      multiplier: 1 + (subIdx * 0.15)
    };
  });

  const handleComplete = (score) => {
    const xpGain = Math.round(score * (activeLevel?.multiplier || 1));
    const newState = { ...state, totalXP: state.totalXP + xpGain };
    const finalState = unlockLevel(newState, activeLevel.id);
    setState(finalState);
    setActiveGame(null);
    setActiveLevel(null);
  };

  if (activeGame) {
    const GameComponent = {
      runner: VantageRun,
      shooter: StellarStriker,
      match: GravityMatch,
      tower: VoidClimb,
      sort: NebulaSort
    }[activeGame];

    return (
      <div className="fixed inset-0 z-50 bg-[#050816] flex flex-col">
        <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
          <button className="btn-arcade" onClick={() => setActiveGame(null)}>✕ Quit Dimension</button>
          <div className="text-right">
            <div className="text-xs font-bold text-white/50 uppercase tracing-widest">{activeLevel.name}</div>
            <div className="text-[10px] text-white/30">SYNCED: {selectedSet.name}</div>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <Suspense fallback={<div className="h-full flex items-center justify-center text-white">LOADING DIMENSION...</div>}>
            <GameComponent 
              studySet={selectedSet} 
              onComplete={handleComplete} 
              level={activeLevel} 
              lowGraphics={false} 
              reduceMotion={false} 
            />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-8">
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter italic">VANTAGE ARCADE</h1>
          <p className="text-white/40 font-mono tracking-widest text-xs">50 LEVELS OF COGNITIVE ACCELERATION</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-indigo-400 leading-tight">{state.totalXP.toLocaleString()} XP</div>
          <div className="text-xs font-bold opacity-40 uppercase">{getLevelTitle(state.totalXP)} · LVL {getLevel(state.totalXP)}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {LEVELS.map((lvl, i) => {
            const isCompleted = state.completedLevels.includes(lvl.id);
            const isUnlocked = i === 0 || state.completedLevels.includes(`game_${i-1}`);
            
            return (
              <motion.div 
                key={lvl.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                onClick={() => isUnlocked && (setActiveGame(lvl.archetypeId), setActiveLevel(lvl))}
                className={`level-card p-6 rounded-2xl bg-white/5 border border-white/5 text-center ${isUnlocked ? 'cursor-pointer' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                style={{ borderColor: isUnlocked ? `${lvl.color}33` : undefined }}
              >
                {!isUnlocked && <div className="absolute top-4 right-4 text-xs opacity-50">🔒</div>}
                {isCompleted && <div className="absolute top-4 left-4 text-[10px] font-black text-emerald-400">✓ DONE</div>}
                <div className="text-4xl mb-4 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-white/5 shadow-2xl" style={{ color: lvl.color }}>
                   {isUnlocked ? lvl.icon : '?'}
                </div>
                <div className="text-xs font-bold mb-1 opacity-90">{isUnlocked ? lvl.name : 'Unknown Sector'}</div>
                <div className="text-indigo-500 text-[10px] font-mono">{'⭐'.repeat(lvl.difficulty)}</div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
