import React from 'react';

interface BettingTableProps {
  onBetPlace: (position: string) => void;
  selectedPositions: Set<string>;
  disabled: boolean;
  isRed: (number: number) => boolean;
  currentBets: Map<string, number>;
}

export const BettingTable: React.FC<BettingTableProps> = ({
  onBetPlace,
  selectedPositions,
  disabled,
  isRed,
  currentBets
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {['red', 'black', 'even', 'odd'].map((option) => (
          <button
            key={option}
            onClick={() => onBetPlace(option)}
            disabled={disabled}
            className={`px-6 py-3 rounded-lg font-bold capitalize transition-colors ${
              selectedPositions.has(option)
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{option}</span>
            {currentBets.has(option) && (
              <span className="ml-2 text-sm bg-black/30 px-2 py-1 rounded">
                {currentBets.get(option)} chips
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-1">
        <button
          onClick={() => onBetPlace('0')}
          disabled={disabled}
          className={`p-2 font-bold bg-green-600 rounded transition-colors ${
            selectedPositions.has('0') ? 'ring-2 ring-yellow-400' : ''
          } hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed relative group`}
        >
          0
          {currentBets.has('0') && (
            <span className="absolute -top-2 -right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded-full">
              {currentBets.get('0')}
            </span>
          )}
        </button>
        {Array.from({ length: 36 }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => onBetPlace(number.toString())}
            disabled={disabled}
            className={`p-2 text-sm font-bold rounded transition-colors ${
              isRed(number) ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'
            } ${
              selectedPositions.has(number.toString()) ? 'ring-2 ring-yellow-400' : ''
            } disabled:opacity-50 disabled:cursor-not-allowed relative group`}
          >
            {number}
            {currentBets.has(number.toString()) && (
              <span className="absolute -top-2 -right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded-full">
                {currentBets.get(number.toString())}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};