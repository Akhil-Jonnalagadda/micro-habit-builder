import React, { useState } from 'react';
import { useHabits, CATEGORIES } from '../context/HabitContext';
import AddHabitForm from '../components/AddHabitForm';
import HabitCard from '../components/HabitCard';

const Library = () => {
  const { habits, deleteHabit, updateHabit, darkMode } = useHabits();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort habits
  const filteredHabits = habits
    .filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || habit.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteHabit(habitId);
    }
  };

  const toggleHabitActive = (habitId, currentStatus) => {
    updateHabit(habitId, { isActive: !currentStatus });
  };

  const categoryStats = Object.entries(CATEGORIES).map(([key, category]) => {
    const count = habits.filter(habit => habit.category === key).length;
    return { key, category, count };
  });

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Habit Library
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage and organize your habits
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              <span className="mr-2">➕</span>
              Add New Habit
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {habits.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Habits</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {habits.filter(h => h.isActive).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {habits.filter(h => !h.isActive).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Paused</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(habits.map(h => h.category)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Search & Filter
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Search habits
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or description..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="ALL">All Categories</option>
                      {Object.entries(CATEGORIES).map(([key, category]) => (
                        <option key={key} value={key}>
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort by
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categoryStats.map(({ key, category, count }) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        selectedCategory === key
                          ? 'bg-primary-100 dark:bg-primary-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === key ? 'ALL' : key)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.emoji}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCategory === 'ALL' ? 'All Habits' : `${CATEGORIES[selectedCategory]?.name} Habits`}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredHabits.length} habit{filteredHabits.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {filteredHabits.length > 0 ? (
                  <div className="space-y-4">
                    {filteredHabits.map((habit) => (
                      <div key={habit.id} className="relative group">
                        <HabitCard habit={habit} />
                        
                        {/* Action buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleHabitActive(habit.id, habit.isActive)}
                              className={`p-1 rounded-md text-xs transition-colors ${
                                habit.isActive
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                              title={habit.isActive ? 'Pause habit' : 'Activate habit'}
                            >
                              {habit.isActive ? '⏸️' : '▶️'}
                            </button>
                            <button
                              onClick={() => handleDeleteHabit(habit.id)}
                              className="p-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-md text-xs transition-colors"
                              title="Delete habit"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {/* Status indicator */}
                        {!habit.isActive && (
                          <div className="absolute top-2 left-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Paused
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                      {searchTerm || selectedCategory !== 'ALL' ? '🔍' : '📚'}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {searchTerm || selectedCategory !== 'ALL' 
                        ? 'No habits found' 
                        : 'No habits yet'
                      }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchTerm || selectedCategory !== 'ALL'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Start building better habits by adding your first micro-habit!'
                      }
                    </p>
                    {!searchTerm && selectedCategory === 'ALL' && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <span className="mr-2">➕</span>
                        Add Your First Habit
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddForm && (
        <AddHabitForm onClose={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default Library;