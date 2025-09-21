import React from 'react';
import { useHabits, BADGES } from '../context/HabitContext';

const Badge = ({ badgeKey, size = 'md', showTooltip = true }) => {
  const { darkMode } = useHabits();
  const badge = BADGES[badgeKey];

  if (!badge) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="relative group">
        <div className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-200 to-yellow-400 dark:from-yellow-300 dark:to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300 dark:border-yellow-400 hover:scale-110 transition-transform cursor-pointer`}>
          <span>{badge.emoji}</span>
        </div>
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
            <div className="font-medium">{badge.name}</div>
            <div className="text-gray-300 dark:text-gray-400">{badge.description}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const BadgeDisplay = ({ badges = [], title = "Your Badges", emptyMessage = "No badges earned yet" }) => {
  const { darkMode } = useHabits();

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        
        {badges.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {badges.map((badgeKey) => (
              <div key={badgeKey} className="flex flex-col items-center space-y-1">
                <Badge badgeKey={badgeKey} size="md" showTooltip={true} />
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {BADGES[badgeKey]?.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-gray-500 dark:text-gray-400">
              {emptyMessage}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Complete habits to earn badges!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BadgeProgress = () => {
  const { badges, getTotalCompletions, getLongestStreak, habits, completions, darkMode } = useHabits();

  const getCompletedCategories = () => {
    const categories = new Set();
    habits.forEach(habit => {
      if (Object.values(completions[habit.id] || {}).some(Boolean)) {
        categories.add(habit.category);
      }
    });
    return Array.from(categories);
  };

  const progressData = [
    {
      badge: 'STARTER',
      name: 'Starter',
      description: 'Complete your first habit',
      progress: Math.min(getTotalCompletions(), 1),
      target: 1,
      earned: badges.includes('STARTER')
    },
    {
      badge: 'CONSISTENT',
      name: 'Consistent',
      description: 'Maintain a 7-day streak',
      progress: Math.min(getLongestStreak(), 7),
      target: 7,
      earned: badges.includes('CONSISTENT')
    },
    {
      badge: 'DEDICATED',
      name: 'Dedicated',
      description: 'Maintain a 30-day streak',
      progress: Math.min(getLongestStreak(), 30),
      target: 30,
      earned: badges.includes('DEDICATED')
    },
    {
      badge: 'DIVERSE',
      name: 'Diverse',
      description: 'Complete habits in 5 different categories',
      progress: Math.min(getCompletedCategories().length, 5),
      target: 5,
      earned: badges.includes('DIVERSE')
    },
    {
      badge: 'MILESTONE',
      name: 'Milestone',
      description: 'Complete 100 total habits',
      progress: Math.min(getTotalCompletions(), 100),
      target: 100,
      earned: badges.includes('MILESTONE')
    }
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Badge Progress
        </h3>
        
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item.badge} className="flex items-center space-x-3">
              <div className={`flex-shrink-0 ${item.earned ? '' : 'grayscale'}`}>
                <Badge badgeKey={item.badge} size="sm" showTooltip={false} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${item.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.name} {item.earned && '✓'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.progress}/{item.target}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.earned 
                        ? 'bg-green-500' 
                        : 'bg-primary-500'
                    }`}
                    style={{ width: `${Math.min((item.progress / item.target) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Badge, BadgeDisplay, BadgeProgress };
export default Badge;