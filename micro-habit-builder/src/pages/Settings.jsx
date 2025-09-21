import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';

const Settings = () => {
  const { 
    darkMode, 
    toggleDarkMode, 
    updateSettings, 
    settings, 
    habits, 
    completions,
    notifications 
  } = useHabits();
  const [activeTab, setActiveTab] = useState('general');

  const exportData = () => {
    const data = {
      habits,
      completions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.habits && data.completions) {
          if (window.confirm('This will replace all your current data. Are you sure?')) {
            // This would need to be implemented in the context
            console.log('Import data:', data);
            alert('Import feature would be implemented here');
          }
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your habits and progress. Type "DELETE" to confirm.')) {
        // This would need to be implemented in the context
        alert('Clear data feature would be implemented here');
      }
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'data', label: 'Data & Privacy', icon: '🗃️' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Customize your habit building experience
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Appearance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Dark Mode
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Switch between light and dark themes
                          </p>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            darkMode ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              darkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Default Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Default habit frequency
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Weekdays</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Default habit category
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors">
                          <option>Health</option>
                          <option>Productivity</option>
                          <option>Wellness</option>
                          <option>Fitness</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Browser Notifications
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Receive browser notifications for achievements and reminders
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            if (!settings.notifications) {
                              // Request permission when enabling notifications
                              const granted = await notifications.requestPermission();
                              if (!granted) {
                                alert('Notification permission denied. Please enable notifications in your browser settings.');
                                return;
                              }
                            }
                            updateSettings({ notifications: !settings.notifications });
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sound Notifications
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Play sounds for achievements and completions
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newSoundSetting = !settings.soundEnabled;
                            notifications.toggleSound(newSoundSetting);
                            updateSettings({ soundEnabled: newSoundSetting });
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.soundEnabled ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Streak Reminders
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notified when you're about to lose a streak
                          </p>
                        </div>
                        <button
                          onClick={() => updateSettings({ streakReminders: !settings.streakReminders })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.streakReminders ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.streakReminders ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Test Notifications
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          if (settings.notifications) {
                            notifications.showHabitReminder('Test Habit', 5);
                          } else {
                            alert('Please enable notifications first');
                          }
                        }}
                        className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🔔 Test Habit Reminder
                      </button>
                      
                      <button
                        onClick={() => {
                          if (settings.notifications) {
                            notifications.showAchievementNotification('Test Badge', 'You earned a test achievement!');
                          } else {
                            alert('Please enable notifications first');
                          }
                        }}
                        className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-0 md:ml-2"
                      >
                        🏆 Test Achievement
                      </button>

                      <button
                        onClick={() => notifications.playSound('success')}
                        className="w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ml-0 md:ml-2"
                      >
                        🔊 Test Sound
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Notification Status
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Browser Support:</span>
                          <span className={notifications.isSupported ? 'text-green-600' : 'text-red-600'}>
                            {notifications.isSupported ? '✅ Supported' : '❌ Not Supported'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Permission Status:</span>
                          <span className={notifications.isPermissionGranted ? 'text-green-600' : 'text-yellow-600'}>
                            {notifications.isPermissionGranted ? '✅ Granted' : '⚠️ Not Granted'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Sound Enabled:</span>
                          <span className={notifications.soundEnabled ? 'text-green-600' : 'text-gray-600'}>
                            {notifications.soundEnabled ? '🔊 On' : '🔇 Off'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Reminder Time
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Daily reminder time
                        </label>
                        <input
                          type="time"
                          defaultValue="09:00"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Note: Scheduled reminders will be implemented in a future update
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Privacy */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Data Management
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                          Export Your Data
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Download all your habits and completion data as a JSON file
                        </p>
                        <button
                          onClick={exportData}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700 transition-colors"
                        >
                          📁 Export Data
                        </button>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                        <h4 className="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
                          Import Data
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                          Restore your data from a previously exported file
                        </p>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importData}
                          className="block w-full text-sm text-green-700 dark:text-green-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200 dark:file:bg-green-800 dark:file:text-green-200 dark:hover:file:bg-green-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Privacy
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                          Local Storage
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          All your data is stored locally in your browser. We don't collect or transmit any personal information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                        Clear All Data
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        Permanently delete all your habits, completions, and settings. This action cannot be undone.
                      </p>
                      <button
                        onClick={clearAllData}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700 transition-colors"
                      >
                        🗑️ Clear All Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Micro-Habit Builder
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      Version 1.0.0
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                      Build better habits one small step at a time. Track your progress, earn badges, 
                      and create lasting positive changes in your life.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        🚀 Features
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>• Track daily micro-habits</li>
                        <li>• Visual progress tracking</li>
                        <li>• Achievement badges</li>
                        <li>• Streak monitoring</li>
                        <li>• Category organization</li>
                        <li>• Dark mode support</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        📊 Your Stats
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Habits:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{habits.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Days Active:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {Math.ceil((new Date() - new Date('2024-01-01')) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Data Size:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(JSON.stringify({ habits, completions }).length / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>Built with React, Tailwind CSS, and ❤️</p>
                    <p className="mt-1">Your data is stored locally and never leaves your device.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;