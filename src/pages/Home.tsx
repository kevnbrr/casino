import React from 'react';
import { CircleDollarSign, Dices } from 'lucide-react';
import { GameCard } from '../components/Home/GameCard';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to kevnbrr.fun</h1>
          <p className="text-xl text-gray-400">Choose your game and start playing!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <GameCard
            title="Blackjack"
            description="Test your luck and skill in this classic card game"
            icon={CircleDollarSign}
            path="/blackjack"
            gradient="bg-gradient-to-br from-purple-600 to-blue-600"
          />
          <GameCard
            title="Roulette"
            description="Place your bets and watch the wheel spin"
            icon={Dices}
            path="/roulette"
            gradient="bg-gradient-to-br from-red-600 to-pink-600"
          />
        </div>
      </div>
    </div>
  );
};