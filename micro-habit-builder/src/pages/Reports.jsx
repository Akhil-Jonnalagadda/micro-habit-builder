import React, { useState } from 'react';
import { useHabits, CATEGORIES } from '../context/HabitContext';
import Heatmap from '../components/Heatmap';
import { BadgeProgress } from '../components/Badge';

const Reports = () => {
  const { habits, completions, getTotalCompletions, getLongestStreak, darkMode } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  // Calculate stats
  const getCompletionRate = () => {
    const today = new Date();
    const daysToCheck = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    let totalPossible = 0;
    let totalCompleted = 0;

    for (let i = 0; i < daysToCheck; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const activeHabits = habits.filter(habit => {
        const habitStart = new Date(habit.createdAt);
        return habitStart <= date && habit.isActive;
      });

      totalPossible += activeHabits.length;
      totalCompleted += activeHabits.filter(habit => 
        completions[habit.id]?.[dateStr]
      ).length;
    }

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

  const getCategoryStats = () => {
    const stats = {};
    
    Object.keys(CATEGORIES).forEach(categoryKey => {
      const categoryHabits = habits.filter(habit => habit.category === categoryKey);
      let totalCompletions = 0;
      
      categoryHabits.forEach(habit => {
        const habitCompletions = completions[habit.id] || {};
        totalCompletions += Object.values(habitCompletions).filter(Boolean).length;
      });

      stats[categoryKey] = {
        ...CATEGORIES[categoryKey],
        habitCount: categoryHabits.length,
        completions: totalCompletions
      };
    });

    return stats;
  };

  const getWeeklyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const activeHabits = habits.filter(habit => {
        const habitStart = new Date(habit.createdAt);
        return habitStart <= date && habit.isActive;
      });

      const completed = activeHabits.filter(habit => 
        completions[habit.id]?.[dateStr]
      ).length;

      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: activeHabits.length,
        completed: completed,
        percentage: activeHabits.length > 0 ? Math.round((completed / activeHabits.length) * 100) : 0
      });
    }
    
    return data;
  };

  const getBestPerformingHabits = () => {
    return habits
      .map(habit => {
        const habitCompletions = completions[habit.id] || {};
        const totalDays = Object.keys(habitCompletions).length;
        const completedDays = Object.values(habitCompletions).filter(Boolean).length;
        const successRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
        
        return {
          ...habit,
          successRate,
          totalCompletions: completedDays,
          totalDays
        };
      })
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5);
  };

  const categoryStats = getCategoryStats();
  const weeklyData = getWeeklyData();
  const bestHabits = getBestPerformingHabits();

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reports & Analytics
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track your progress and gain insights into your habits
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg inline-flex">
              {[
                { key: 'week', label: 'Week' },
                { key: 'month', label: 'Month' },
                { key: 'year', label: 'Year' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range.key
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl mr-4">
                  📊
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getCompletionRate()}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-2xl mr-4">
                  ✅
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getTotalCompletions()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 text-2xl mr-4">
                  🔥
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Longest Streak
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getLongestStreak()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-2xl mr-4">
                  📈
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Habits
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {habits.filter(h => h.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Weekly Progress
              </h3>
              <div className="space-y-3">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-8">
                        {day.date}
                      </span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-32">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${day.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {day.completed}/{day.total} ({day.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Category Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(categoryStats)
                  .filter(([_, stats]) => stats.habitCount > 0)
                  .sort((a, b) => b[1].completions - a[1].completions)
                  .map(([key, stats]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{stats.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {stats.name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stats.completions} completions ({stats.habitCount} habits)
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Best Performing Habits */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Best Performing Habits
                </h3>
                {bestHabits.length > 0 ? (
                  <div className="space-y-4">
                    {bestHabits.map((habit, index) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {habit.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {CATEGORIES[habit.category]?.emoji} {CATEGORIES[habit.category]?.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {habit.successRate}%
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {habit.totalCompletions}/{habit.totalDays} days
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No habit data available yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Badge Progress */}
            <div>
              <BadgeProgress />
            </div>
          </div>

          {/* Heatmap Section */}
          {habits.length > 0 && (
            <div className="mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Activity Heatmap
                  </h3>
                  <select
                    value={selectedHabit || ''}
                    onChange={(e) => setSelectedHabit(e.target.value || null)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">All Habits Combined</option>
                    {habits.map(habit => (
                      <option key={habit.id} value={habit.id}>
                        {habit.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Heatmap habitId={selectedHabit} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;