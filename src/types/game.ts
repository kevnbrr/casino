export interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number;
  face: string;
}

export interface BlackjackState {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  playerScore: number;
  dealerScore: number;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'finished';
  bet: number;
  chips: number;
  message: string;
}

export interface RouletteState {
  numbers: number[];
  currentBets: Map<string, number>;
  lastResults: number[];
  spinning: boolean;
  chips: number;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  chips: number;
}