import React from 'react';
import { useHabits, CATEGORIES } from '../context/HabitContext';

const HabitCard = ({ habit, date = new Date().toISOString().split('T')[0] }) => {
  const { toggleHabit, getHabitCompletions, getCurrentStreak, darkMode } = useHabits();
  
  const completions = getHabitCompletions(habit.id);
  const isCompleted = completions[date] || false;
  const streak = getCurrentStreak(habit.id);
  const category = CATEGORIES[habit.category] || CATEGORIES.HEALTH;

  const handleToggle = () => {
    toggleHabit(habit.id, date);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {/* Checkbox */}
            <button
              onClick={handleToggle}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-success-500 border-success-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-success-400 dark:hover:border-success-400'
              }`}
              aria-label={`${isCompleted ? 'Mark incomplete' : 'Mark complete'}: ${habit.name}`}
            >
              {isCompleted && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Habit details */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-medium transition-colors ${
                  isCompleted 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {habit.name}
                </h3>
                
                {/* Category badge */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </span>
              </div>
              
              {habit.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          {/* Streak indicator */}
          {streak > 0 && (
            <div className="flex items-center space-x-1 ml-3">
              <span className="text-orange-500 text-lg">🔥</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {streak}
              </span>
            </div>
          )}
        </div>

        {/* Progress indicator for completed habit */}
        {isCompleted && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-success-600 dark:text-success-400">
            <span>✅</span>
            <span>Completed! +10 points</span>
          </div>
        )}

        {/* Frequency indicator */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <span>📅</span>
            <span>{habit.frequency || 'Daily'}</span>
          </span>
          
          {habit.targetDuration && (
            <span className="flex items-center space-x-1">
              <span>⏱️</span>
              <span>{habit.targetDuration}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;