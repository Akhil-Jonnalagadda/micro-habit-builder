import React from 'react';
import { useHabits } from '../context/HabitContext';
import HabitCard from '../components/HabitCard';
import ProgressBar from '../components/ProgressBar';
import { BadgeDisplay } from '../components/Badge';

const Dashboard = () => {
  const { 
    habits, 
    badges, 
    points, 
    getTotalCompletions, 
    getLongestStreak, 
    darkMode,
    notifications 
  } = useHabits();
  
  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Filter active habits for today
  const todayHabits = habits.filter(habit => {
    const habitStart = new Date(habit.createdAt);
    const checkDate = new Date(today);
    return habitStart <= checkDate && habit.isActive;
  });

  const stats = [
    {
      title: 'Total Points',
      value: points,
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    },
    {
      title: 'Total Habits Completed',
      value: getTotalCompletions(),
      icon: '✅',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    {
      title: 'Longest Streak',
      value: `${getLongestStreak()} days`,
      icon: '🔥',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    },
    {
      title: 'Badges Earned',
      value: badges.length,
      icon: '🏆',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {todayFormatted}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color} text-2xl mr-4`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Habits */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Today's Habits
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {todayHabits.length} habit{todayHabits.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {todayHabits.length > 0 ? (
                  <div className="space-y-4">
                    {todayHabits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} date={today} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No habits for today
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Start building better habits by adding your first micro-habit!
                    </p>
                    <button
                      onClick={() => window.location.href = '/library'}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      <span className="mr-2">➕</span>
                      Add Your First Habit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active Habits</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {habits.filter(h => h.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getWeeklyCompletions()} completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getSuccessRate()}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Badges */}
              <BadgeDisplay 
                badges={badges.slice(-3)} 
                title="Recent Badges"
                emptyMessage="Complete habits to earn badges!"
              />

              {/* Motivational Quote */}
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-md p-6 text-white">
                <div className="text-center">
                  <div className="text-3xl mb-3">💪</div>
                  <blockquote className="text-sm italic mb-2">
                    "Success is the sum of small efforts repeated day in and day out."
                  </blockquote>
                  <cite className="text-xs opacity-80">- Robert Collier</cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function getWeeklyCompletions() {
    // Implementation for weekly completions
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    let count = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      habits.forEach(habit => {
        if (habit.completions && habit.completions[dateStr]) {
          count++;
        }
      });
    }
    
    return count;
  }

  function getSuccessRate() {
    // Simple success rate calculation
    const totalPossible = habits.length * 7; // Last 7 days
    const totalCompleted = getWeeklyCompletions();
    
    if (totalPossible === 0) return 0;
    return Math.round((totalCompleted / totalPossible) * 100);
  }
};

export default Dashboard;