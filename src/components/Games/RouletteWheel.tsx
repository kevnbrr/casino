import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface RouletteWheelProps {
  spinning: boolean;
}

export const RouletteWheel = forwardRef<{ spinToNumber: (num: number) => void }, RouletteWheelProps>(
  ({ spinning }, ref) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const ballRef = useRef<HTMLDivElement>(null);

    // Roulette wheel number sequence
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
      5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];

    useImperativeHandle(ref, () => ({
      spinToNumber: (targetNumber: number) => {
        if (!wheelRef.current || !ballRef.current) return;

        const targetIndex = numbers.indexOf(targetNumber);
        const rotations = 5; // Number of full rotations before landing
        const degreesPerNumber = 360 / numbers.length;
        const targetDegrees = targetIndex * degreesPerNumber;
        const totalDegrees = rotations * 360 + targetDegrees;

        // Reset any previous animations
        wheelRef.current.style.transform = 'rotate(0deg)';
        ballRef.current.style.transform = 'rotate(0deg)';

        // Animate the wheel and ball
        wheelRef.current.style.transform = `rotate(${-totalDegrees}deg)`;
        ballRef.current.style.transform = `rotate(${totalDegrees}deg)`;
      }
    }));

    return (
      <div className="relative aspect-square">
        {/* Static background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl">
          {/* Wheel segments */}
          <div
            ref={wheelRef}
            className="absolute inset-0 transition-transform duration-[8s] ease-out"
          >
            {numbers.map((number, index) => {
              const rotation = (index * (360 / numbers.length)).toFixed(2);
              const isRed = [
                1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
              ].includes(number);
              
              return (
                <div
                  key={number}
                  className="absolute w-full h-full"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 h-1/2 w-[2px] origin-bottom ${
                      isRed ? 'bg-red-600' : number === 0 ? 'bg-green-600' : 'bg-gray-900'
                    }`}
                  >
                    <span
                      className="absolute -top-6 left-1/2 -translate-x-1/2 text-white text-sm font-bold"
                      style={{ transform: `rotate(${-Number(rotation)}deg)` }}
                    >
                      {number}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ball */}
          <div
            ref={ballRef}
            className="absolute top-0 left-1/2 w-4 h-4 -ml-2 transition-transform duration-[8s] ease-out"
          >
            <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
          </div>

          {/* Center decoration */}
          <div className="absolute inset-[40%] bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-inner">
            <div className="absolute inset-[20%] bg-gradient-to-br from-gray-800 to-gray-900 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
);