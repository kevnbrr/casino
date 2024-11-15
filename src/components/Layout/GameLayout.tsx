import React from 'react';
import { Trophy, Timer, Coins } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, title }) => {
  const { stats } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <p className="font-bold">
                  {stats.gamesPlayed > 0
                    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3">
              <Timer className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400">Games Played</p>
                <p className="font-bold">{stats.gamesPlayed}</p>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3">
              <Coins className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-400">Total Chips</p>
                <p className="font-bold">{stats.chips}</p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};