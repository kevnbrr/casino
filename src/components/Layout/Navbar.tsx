import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Coins } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

export const Navbar: React.FC = () => {
  const { stats } = useGameStore();

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-emerald-500" />
            <span className="font-bold text-xl">kevnbrr.fun</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{stats.chips}</span>
            </div>
            <Link
              to="/blackjack"
              className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Blackjack
            </Link>
            <Link
              to="/roulette"
              className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Roulette
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};