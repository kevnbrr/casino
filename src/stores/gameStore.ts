import { create } from 'zustand';
import { GameStats } from '../types/game';

interface GameStore {
  stats: GameStats;
  updateStats: (newStats: Partial<GameStats>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  stats: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    chips: 1000,
  },
  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
}));