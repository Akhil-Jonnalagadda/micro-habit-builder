// Demo data for testing the application
export const DEMO_HABITS = [
  {
    id: 'demo-1',
    name: 'Drink a glass of water',
    description: 'Start the day with hydration',
    category: 'HEALTH',
    frequency: 'Daily',
    targetDuration: '1 minute',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'demo-2',
    name: 'Write one sentence',
    description: 'Daily writing practice',
    category: 'PRODUCTIVITY',
    frequency: 'Daily',
    targetDuration: '5 minutes',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'demo-3',
    name: 'Take 10 deep breaths',
    description: 'Mindful breathing exercise',
    category: 'WELLNESS',
    frequency: 'Daily',
    targetDuration: '2 minutes',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'demo-4',
    name: '10 push-ups',
    description: 'Quick strength exercise',
    category: 'FITNESS',
    frequency: 'Daily',
    targetDuration: '2 minutes',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  }
];

export const DEMO_COMPLETIONS = {
  'demo-1': {
    [new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
  },
  'demo-2': {
    [new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
  },
  'demo-3': {
    [new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
  },
  'demo-4': {
    [new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
    [new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]]: true,
  }
};

export const initializeDemoData = () => {
  const existingData = localStorage.getItem('habitBuilderData');
  if (!existingData) {
    const demoData = {
      habits: DEMO_HABITS,
      completions: DEMO_COMPLETIONS,
      points: 180, // Based on demo completions
      badges: ['STARTER', 'CONSISTENT'],
      darkMode: false,
      settings: {
        notifications: true,
        streakReminders: true
      }
    };
    localStorage.setItem('habitBuilderData', JSON.stringify(demoData));
  }
};