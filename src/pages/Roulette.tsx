import React, { useState, useRef, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { GameLayout } from '../components/Layout/GameLayout';
import { useGameStore } from '../stores/gameStore';
import { RouletteState } from '../types/game';
import { RouletteWheel } from '../components/Games/RouletteWheel';
import { BettingTable } from '../components/Games/BettingTable';

export const Roulette: React.FC = () => {
  const { stats, updateStats } = useGameStore();
  const [selectedBetAmount, setSelectedBetAmount] = useState<number>(25);
  const [customBetAmount, setCustomBetAmount] = useState<string>('');
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(new Set());
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const wheelRef = useRef<{ spinToNumber: (num: number) => void }>(null);
  
  const [gameState, setGameState] = useState<RouletteState>({
    numbers: Array.from({ length: 37 }, (_, i) => i),
    currentBets: new Map(),
    lastResults: [],
    spinning: false,
    chips: stats.chips,
  });

  const handleCustomBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= gameState.chips) {
      setCustomBetAmount(value);
      setSelectedBetAmount(Number(value));
    }
  };

  const placeBet = (position: string) => {
    if (gameState.spinning) return;

    const currentBet = gameState.currentBets.get(position) || 0;
    const newBets = new Map(gameState.currentBets);

    if (selectedPositions.has(position)) {
      // Remove bet
      newBets.delete(position);
      setSelectedPositions(prev => {
        const next = new Set(prev);
        next.delete(position);
        return next;
      });
      setGameState(prev => ({
        ...prev,
        currentBets: newBets,
        chips: prev.chips + currentBet,
      }));
    } else if (selectedBetAmount <= gameState.chips) {
      // Add bet
      newBets.set(position, currentBet + selectedBetAmount);
      setSelectedPositions(prev => new Set(prev.add(position)));
      setGameState(prev => ({
        ...prev,
        currentBets: newBets,
        chips: prev.chips - selectedBetAmount,
      }));
    }
  };

  const spin = () => {
    if (gameState.spinning || gameState.currentBets.size === 0) return;

    setGameState({ ...gameState, spinning: true });
    const result = Math.floor(Math.random() * 37);
    
    wheelRef.current?.spinToNumber(result);

    setTimeout(() => {
      const winnings = calculateWinnings(result);
      const newChips = gameState.chips + winnings;

      if (winnings > 0) {
        setWinAmount(winnings);
        setShowWinMessage(true);
        setTimeout(() => setShowWinMessage(false), 5000);
      }

      updateStats({
        gamesPlayed: stats.gamesPlayed + 1,
        wins: winnings > 0 ? stats.wins + 1 : stats.wins,
        losses: winnings === 0 ? stats.losses + 1 : stats.losses,
        chips: newChips,
      });

      setGameState({
        ...gameState,
        spinning: false,
        lastResults: [result, ...gameState.lastResults].slice(0, 10),
        currentBets: new Map(),
        chips: newChips,
      });
      setSelectedPositions(new Set());
    }, 8000);
  };

  const calculateWinnings = (result: number): number => {
    let winnings = 0;

    gameState.currentBets.forEach((bet, position) => {
      if (position === result.toString()) {
        winnings += bet * 35;
      } else if (
        (position === 'red' && isRed(result)) ||
        (position === 'black' && !isRed(result))
      ) {
        winnings += bet * 2;
      } else if (
        (position === 'even' && result % 2 === 0 && result !== 0) ||
        (position === 'odd' && result % 2 === 1)
      ) {
        winnings += bet * 2;
      }
    });

    return winnings;
  };

  const isRed = (number: number): boolean => {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number);
  };

  return (
    <GameLayout title="Roulette">
      {showWinMessage && (
        <>
          <ReactConfetti
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-black/80 text-white px-8 py-4 rounded-lg text-3xl font-bold animate-bounce">
              You Won {winAmount} Chips! 🎉
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Roulette Wheel</h3>
            <RouletteWheel ref={wheelRef} spinning={gameState.spinning} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Select Bet Amount</h3>
              <div className="flex flex-wrap gap-4">
                {[25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedBetAmount(amount);
                      setCustomBetAmount('');
                    }}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                      selectedBetAmount === amount && !customBetAmount
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {amount} Chips
                  </button>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customBetAmount}
                    onChange={handleCustomBetChange}
                    placeholder="Custom amount"
                    className="px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            <BettingTable
              onBetPlace={placeBet}
              selectedPositions={selectedPositions}
              disabled={gameState.spinning}
              isRed={isRed}
              currentBets={gameState.currentBets}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={spin}
            disabled={gameState.spinning || gameState.currentBets.size === 0}
            className="px-8 py-4 bg-yellow-600 rounded-lg font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-700 transition-colors"
          >
            {gameState.spinning ? 'Spinning...' : 'SPIN!'}
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Last Results</h3>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {gameState.lastResults.map((result, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  isRed(result) ? 'bg-red-600' : result === 0 ? 'bg-green-600' : 'bg-gray-900'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameLayout>
  );
};