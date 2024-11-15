import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  gradient,
}) => {
  return (
    <Link
      to={path}
      className={`block p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 ${gradient}`}
    >
      <div className="flex items-center space-x-4">
        <Icon className="h-8 w-8 text-white" />
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-100 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};