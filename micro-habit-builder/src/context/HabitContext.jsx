import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';

const HabitContext = createContext();

// Categories with emojis
export const CATEGORIES = {
  HEALTH: { name: 'Health', emoji: '🍎', color: 'bg-red-100 text-red-800' },
  PRODUCTIVITY: { name: 'Productivity', emoji: '📚', color: 'bg-blue-100 text-blue-800' },
  WELLNESS: { name: 'Wellness', emoji: '💧', color: 'bg-teal-100 text-teal-800' },
  FITNESS: { name: 'Fitness', emoji: '💪', color: 'bg-orange-100 text-orange-800' },
  CREATIVITY: { name: 'Creativity', emoji: '🎨', color: 'bg-purple-100 text-purple-800' },
  SOCIAL: { name: 'Social', emoji: '👥', color: 'bg-green-100 text-green-800' },
  LEARNING: { name: 'Learning', emoji: '🧠', color: 'bg-indigo-100 text-indigo-800' },
  MINDFULNESS: { name: 'Mindfulness', emoji: '🧘', color: 'bg-pink-100 text-pink-800' }
};

// Badges system
export const BADGES = {
  STARTER: { name: 'Starter', emoji: '🌱', description: 'Complete your first habit' },
  CONSISTENT: { name: 'Consistent', emoji: '🔥', description: 'Maintain a 7-day streak' },
  DEDICATED: { name: 'Dedicated', emoji: '💎', description: 'Maintain a 30-day streak' },
  DIVERSE: { name: 'Diverse', emoji: '🌈', description: 'Complete habits in 5 different categories' },
  PERFECTIONIST: { name: 'Perfectionist', emoji: '⭐', description: 'Complete all habits for a day' },
  MILESTONE: { name: 'Milestone', emoji: '🏆', description: 'Complete 100 total habits' }
};

const initialState = {
  habits: [],
  completions: {}, // { habitId: { date: true/false } }
  points: 0,
  badges: [],
  darkMode: false,
  settings: {
    notifications: true,
    streakReminders: true,
    soundEnabled: true
  }
};

const habitReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };

    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, action.payload]
      };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? { ...habit, ...action.payload.updates } : habit
        )
      };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        completions: Object.fromEntries(
          Object.entries(state.completions).filter(([habitId]) => habitId !== action.payload)
        )
      };

    case 'TOGGLE_HABIT':
      const { habitId, date, completed } = action.payload;
      const newCompletions = {
        ...state.completions,
        [habitId]: {
          ...state.completions[habitId],
          [date]: completed
        }
      };

      // Calculate points change
      const pointsChange = completed ? 10 : -10;
      const newPoints = Math.max(0, state.points + pointsChange);

      return {
        ...state,
        completions: newCompletions,
        points: newPoints
      };

    case 'ADD_BADGE':
      return {
        ...state,
        badges: [...state.badges, action.payload]
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    default:
      return state;
  }
};

export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const [persistedData, setPersistedData] = useLocalStorage('habitBuilderData', initialState);
  const notifications = useNotifications();

  // Load data from localStorage on mount
  useEffect(() => {
    if (persistedData) {
      dispatch({ type: 'LOAD_DATA', payload: persistedData });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    setPersistedData(state);
  }, [state, setPersistedData]);

  // Check for new badges
  useEffect(() => {
    checkForNewBadges();
  }, [state.habits, state.completions, state.points]);

  const checkForNewBadges = () => {
    const newBadges = [];

    // Starter badge - first habit completion
    if (!state.badges.includes('STARTER') && getTotalCompletions() >= 1) {
      newBadges.push('STARTER');
    }

    // Consistent badge - 7-day streak
    if (!state.badges.includes('CONSISTENT') && getLongestStreak() >= 7) {
      newBadges.push('CONSISTENT');
    }

    // Dedicated badge - 30-day streak
    if (!state.badges.includes('DEDICATED') && getLongestStreak() >= 30) {
      newBadges.push('DEDICATED');
    }

    // Diverse badge - habits in 5 different categories
    if (!state.badges.includes('DIVERSE') && getCompletedCategories().length >= 5) {
      newBadges.push('DIVERSE');
    }

    // Perfectionist badge - all habits completed in a day
    if (!state.badges.includes('PERFECTIONIST') && hasPerfectDay()) {
      newBadges.push('PERFECTIONIST');
    }

    // Milestone badge - 100 total completions
    if (!state.badges.includes('MILESTONE') && getTotalCompletions() >= 100) {
      newBadges.push('MILESTONE');
    }

    newBadges.forEach(badge => {
      dispatch({ type: 'ADD_BADGE', payload: badge });
      // Show achievement notification with sound
      if (state.settings.notifications) {
        notifications.showAchievementNotification(
          BADGES[badge].name,
          BADGES[badge].description
        );
      }
    });
  };

  const getTotalCompletions = () => {
    return Object.values(state.completions).reduce((total, habitCompletions) => {
      return total + Object.values(habitCompletions).filter(Boolean).length;
    }, 0);
  };

  const getLongestStreak = () => {
    let maxStreak = 0;
    state.habits.forEach(habit => {
      const streak = getCurrentStreak(habit.id);
      maxStreak = Math.max(maxStreak, streak);
    });
    return maxStreak;
  };

  const getCurrentStreak = (habitId) => {
    const today = new Date();
    let streak = 0;
    let date = new Date(today);

    while (date) {
      const dateStr = date.toISOString().split('T')[0];
      if (state.completions[habitId]?.[dateStr]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const getCompletedCategories = () => {
    const categories = new Set();
    state.habits.forEach(habit => {
      if (Object.values(state.completions[habit.id] || {}).some(Boolean)) {
        categories.add(habit.category);
      }
    });
    return Array.from(categories);
  };

  const hasPerfectDay = () => {
    const dates = new Set();
    Object.values(state.completions).forEach(habitCompletions => {
      Object.keys(habitCompletions).forEach(date => {
        if (habitCompletions[date]) {
          dates.add(date);
        }
      });
    });

    return Array.from(dates).some(date => {
      const activeHabitsForDate = state.habits.filter(habit => {
        const habitStart = new Date(habit.createdAt);
        const checkDate = new Date(date);
        return habitStart <= checkDate;
      });

      return activeHabitsForDate.length > 0 && 
             activeHabitsForDate.every(habit => state.completions[habit.id]?.[date]);
    });
  };

  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      ...habitData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  };

  const updateHabit = (id, updates) => {
    dispatch({ type: 'UPDATE_HABIT', payload: { id, updates } });
  };

  const deleteHabit = (id) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  };

  const toggleHabit = (habitId, date = new Date().toISOString().split('T')[0]) => {
    const currentStatus = state.completions[habitId]?.[date] || false;
    const habit = state.habits.find(h => h.id === habitId);
    
    dispatch({
      type: 'TOGGLE_HABIT',
      payload: { habitId, date, completed: !currentStatus }
    });

    // Show notifications for habit completion
    if (!currentStatus && state.settings.notifications && habit) {
      // Play completion sound
      notifications.playSound('success');
      
      // Check for streak milestones
      const newStreak = getCurrentStreak(habitId) + 1;
      if (newStreak === 7 || newStreak === 30 || newStreak % 50 === 0) {
        notifications.showHabitReminder(habit.name, newStreak);
      }
    }
  };

  const getHabitCompletions = (habitId) => {
    return state.completions[habitId] || {};
  };

  const getDailyProgress = (date = new Date().toISOString().split('T')[0]) => {
    const activeHabits = state.habits.filter(habit => {
      const habitStart = new Date(habit.createdAt);
      const checkDate = new Date(date);
      return habitStart <= checkDate && habit.isActive;
    });

    const completedHabits = activeHabits.filter(habit => 
      state.completions[habit.id]?.[date]
    );

    return {
      total: activeHabits.length,
      completed: completedHabits.length,
      percentage: activeHabits.length > 0 ? (completedHabits.length / activeHabits.length) * 100 : 0
    };
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const value = {
    ...state,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    getHabitCompletions,
    getCurrentStreak,
    getDailyProgress,
    toggleDarkMode,
    updateSettings,
    getTotalCompletions,
    getLongestStreak,
    notifications
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};