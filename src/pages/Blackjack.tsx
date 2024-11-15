import React, { useState, useEffect } from 'react';
import { GameLayout } from '../components/Layout/GameLayout';
import { Card as CardComponent } from '../components/Games/Card';
import { useGameStore } from '../stores/gameStore';
import { Card, BlackjackState } from '../types/game';

export const Blackjack: React.FC = () => {
  const { stats, updateStats } = useGameStore();
  const [gameState, setGameState] = useState<BlackjackState>({
    playerHand: [],
    dealerHand: [],
    deck: [],
    playerScore: 0,
    dealerScore: 0,
    gameStatus: 'betting',
    bet: 0,
    chips: stats.chips,
    message: '',
  });

  const createDeck = (): Card[] => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
    const values = Array.from({ length: 13 }, (_, i) => i + 1);
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const value of values) {
        let face = value.toString();
        if (value === 1) face = 'A';
        if (value === 11) face = 'J';
        if (value === 12) face = 'Q';
        if (value === 13) face = 'K';

        deck.push({ suit, value: value === 1 ? 11 : Math.min(value, 10), face });
      }
    }

    return deck;
  };

  const shuffle = (deck: Card[]): Card[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  const calculateScore = (hand: Card[]): number => {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.value === 11) aces++;
      score += card.value;
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const dealInitialCards = (deck: Card[]) => {
    const playerHand = [deck[0], deck[2]];
    const dealerHand = [deck[1], deck[3]];
    const remainingDeck = deck.slice(4);

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore([dealerHand[0]]);

    setGameState((prev) => ({
      ...prev,
      playerHand,
      dealerHand,
      deck: remainingDeck,
      playerScore,
      dealerScore,
      gameStatus: 'playing',
    }));
  };

  const placeBet = (amount: number) => {
    if (amount > gameState.chips) return;

    const newDeck = shuffle(createDeck());
    setGameState((prev) => ({
      ...prev,
      bet: amount,
      chips: prev.chips - amount,
      deck: newDeck,
    }));

    dealInitialCards(newDeck);
  };

  const hit = () => {
    if (gameState.gameStatus !== 'playing') return;

    const newHand = [...gameState.playerHand, gameState.deck[0]];
    const newDeck = gameState.deck.slice(1);
    const newScore = calculateScore(newHand);

    if (newScore > 21) {
      updateStats({
        gamesPlayed: stats.gamesPlayed + 1,
        losses: stats.losses + 1,
        chips: stats.chips - gameState.bet,
      });

      setGameState((prev) => ({
        ...prev,
        playerHand: newHand,
        deck: newDeck,
        playerScore: newScore,
        gameStatus: 'finished',
        message: 'Bust! You went over 21!',
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        playerHand: newHand,
        deck: newDeck,
        playerScore: newScore,
      }));
    }
  };

  const dealerPlay = () => {
    let currentHand = [...gameState.dealerHand];
    let currentDeck = [...gameState.deck];
    let currentScore = calculateScore(currentHand);

    while (currentScore < 17) {
      currentHand.push(currentDeck[0]);
      currentDeck = currentDeck.slice(1);
      currentScore = calculateScore(currentHand);
    }

    return { hand: currentHand, deck: currentDeck, score: currentScore };
  };

  const stand = () => {
    if (gameState.gameStatus !== 'playing') return;

    const { hand: dealerHand, deck, score: dealerScore } = dealerPlay();
    const playerScore = gameState.playerScore;

    let message: string;
    let won = false;

    if (dealerScore > 21) {
      message = 'Dealer bust! You win!';
      won = true;
    } else if (dealerScore < playerScore) {
      message = 'You win!';
      won = true;
    } else if (dealerScore > playerScore) {
      message = 'Dealer wins!';
    } else {
      message = 'Push! It\'s a tie!';
      won = null;
    }

    const winnings = won === true ? gameState.bet * 2 : won === null ? gameState.bet : 0;

    updateStats({
      gamesPlayed: stats.gamesPlayed + 1,
      wins: won === true ? stats.wins + 1 : stats.wins,
      losses: won === false ? stats.losses + 1 : stats.losses,
      chips: stats.chips + winnings,
    });

    setGameState((prev) => ({
      ...prev,
      dealerHand,
      deck,
      dealerScore,
      gameStatus: 'finished',
      message,
      chips: prev.chips + winnings,
    }));
  };

  const resetGame = () => {
    setGameState({
      playerHand: [],
      dealerHand: [],
      deck: [],
      playerScore: 0,
      dealerScore: 0,
      gameStatus: 'betting',
      bet: 0,
      chips: stats.chips,
      message: '',
    });
  };

  useEffect(() => {
    setGameState(prev => ({ ...prev, chips: stats.chips }));
  }, [stats.chips]);

  return (
    <GameLayout title="Blackjack">
      <div className="max-w-4xl mx-auto">
        {gameState.message && (
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-yellow-500">{gameState.message}</p>
          </div>
        )}
        
        {gameState.gameStatus === 'betting' ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold mb-4">Place Your Bet</h2>
            <div className="flex justify-center space-x-4">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => placeBet(amount)}
                  disabled={amount > gameState.chips}
                  className="px-6 py-3 bg-emerald-600 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
                >
                  {amount} Chips
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative bg-green-800 p-8 rounded-2xl shadow-2xl">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Dealer's Hand ({gameState.dealerScore})</h3>
                <div className="flex space-x-4">
                  {gameState.dealerHand.map((card, index) => (
                    <div key={index} className="transform hover:-translate-y-2 transition-transform">
                      <CardComponent
                        card={card}
                        hidden={index === 1 && gameState.gameStatus === 'playing'}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Your Hand ({gameState.playerScore})</h3>
                <div className="flex space-x-4">
                  {gameState.playerHand.map((card, index) => (
                    <div key={index} className="transform hover:-translate-y-2 transition-transform">
                      <CardComponent card={card} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-gray-900/50 px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Current Bet: </span>
                <span className="font-bold text-yellow-400">{gameState.bet} chips</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              {gameState.gameStatus === 'playing' ? (
                <>
                  <button
                    onClick={hit}
                    className="px-8 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                  >
                    Hit
                  </button>
                  <button
                    onClick={stand}
                    className="px-8 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition-colors"
                  >
                    Stand
                  </button>
                </>
              ) : (
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-emerald-600 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};