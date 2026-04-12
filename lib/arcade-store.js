// Persistent arcade state management using localStorage
// Migrated from VantageStudy to Repulsora (Next.js)

const STORAGE_KEY = 'vantageStudyState';

const DEFAULT_STATE = {
  // Core XP and progression
  totalXP: 0, streak: 0, lastStudyDate: null,
  studySets: [], notes: [], activeNoteId: null,
  completedQuests: [], cardsMastered: 0, quizScores: [],
  timerSessions: 0, timerTotalMinutes: 0, studyDays: {},
  plansGenerated: 0,
  
  // Premium subscription
  subscriptionTier: 'free', 
  subscriptionExpiresAt: null,
  isPremium: false,
  
  // Game statistics
  gameStats: {
    runner: { wins: 0, bestScore: 0, totalPlayed: 0 },
    shooter: { wins: 0, bestScore: 0, totalPlayed: 0 },
    match: { wins: 0, bestScore: 0, totalPlayed: 0 },
    tower: { wins: 0, bestScore: 0, totalPlayed: 0 },
    sort: { wins: 0, bestScore: 0, totalPlayed: 0 }
  },
  
  // Mission progression
  completedLevels: [] 
};

export function unlockLevel(state, levelId) {
  if (state.completedLevels.includes(levelId)) return state;
  const next = { ...state, completedLevels: [...state.completedLevels, levelId] };
  saveState(next);
  return next;
}

export function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      return { ...DEFAULT_STATE, ...saved };
    }
    return { ...DEFAULT_STATE };
  } catch (e) {
    console.error('Failed to load state:', e);
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function getLevel(xp) { return 1 + Math.floor(xp / 500); }
export function getXPInLevel(xp) { return xp % 500; }
export function getXPPercent(xp) { return (getXPInLevel(xp) / 500) * 100; }

const TITLES = ['Novice','Learner','Student','Scholar','Apprentice','Adept','Expert','Master','Sage','Genius','Prodigy','Virtuoso','Legend','Mythic','Transcendent'];
export function getLevelTitle(xp) { return TITLES[Math.min(getLevel(xp) - 1, TITLES.length - 1)]; }
