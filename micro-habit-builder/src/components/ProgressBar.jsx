import React from 'react';
import { useHabits } from '../context/HabitContext';

const ProgressBar = ({ date = new Date().toISOString().split('T')[0], showDetails = true }) => {
  const { getDailyProgress, darkMode } = useHabits();
  const progress = getDailyProgress(date);

  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-success-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-yellow-400';
    if (percentage >= 25) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const getProgressMessage = (percentage) => {
    if (percentage === 100) return "Perfect day! 🎉";
    if (percentage >= 75) return "Great progress! 💪";
    if (percentage >= 50) return "Halfway there! 🚀";
    if (percentage >= 25) return "Good start! 👍";
    return "Let's get started! ✨";
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        {showDetails && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Daily Progress
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {progress.completed} of {progress.total} habits
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progress.percentage)}`}
              style={{ width: `${progress.percentage}%` }}
            >
              <div className="h-full bg-gradient-to-r from-transparent to-white opacity-20"></div>
            </div>
          </div>
          
          {/* Percentage label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {Math.round(progress.percentage)}%
            </span>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getProgressMessage(progress.percentage)}
            </p>
          </div>
        )}

        {/* Progress milestones */}
        {showDetails && progress.total > 0 && (
          <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className={progress.percentage >= 25 ? 'text-orange-500' : ''}>25%</span>
            <span className={progress.percentage >= 50 ? 'text-yellow-500' : ''}>50%</span>
            <span className={progress.percentage >= 75 ? 'text-green-500' : ''}>75%</span>
            <span className={progress.percentage === 100 ? 'text-success-500' : ''}>100%</span>
          </div>
        )}

        {progress.total === 0 && showDetails && (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">
              No habits for today. Add some habits to get started! 🎯
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;