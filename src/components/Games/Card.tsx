import React from 'react';
import { Card as CardType } from '../../types/game';

interface CardProps {
  card: CardType;
  hidden?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, hidden = false }) => {
  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black';
  };

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  if (hidden) {
    return (
      <div className="relative w-24 h-36 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl border-2 border-white/10 flex items-center justify-center">
        <div className="absolute inset-2 bg-blue-700 rounded-lg flex items-center justify-center">
          <div className="text-2xl font-bold text-white/20">?</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-24 h-36 bg-white rounded-xl shadow-xl transform transition-transform hover:scale-105">
      <div className="absolute top-2 left-2">
        <div className={`font-bold text-xl ${getSuitColor(card.suit)}`}>
          {card.face}
        </div>
        <div className={`text-2xl ${getSuitColor(card.suit)}`}>
          {getSuitSymbol(card.suit)}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 rotate-180">
        <div className={`font-bold text-xl ${getSuitColor(card.suit)}`}>
          {card.face}
        </div>
        <div className={`text-2xl ${getSuitColor(card.suit)}`}>
          {getSuitSymbol(card.suit)}
        </div>
      </div>
    </div>
  );
};