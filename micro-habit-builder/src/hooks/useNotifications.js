import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '../utils/notificationService';

export const useNotifications = () => {
  const [notificationService] = useState(() => new NotificationService());
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Check initial permission state
    setIsPermissionGranted(notificationService.isEnabled());
  }, [notificationService]);

  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission();
    setIsPermissionGranted(granted);
    return granted;
  }, [notificationService]);

  const showHabitReminder = useCallback(async (habitName, streakCount = 0) => {
    return notificationService.showHabitReminder(habitName, streakCount);
  }, [notificationService]);

  const showAchievementNotification = useCallback(async (badgeName, description) => {
    return notificationService.showAchievementNotification(badgeName, description);
  }, [notificationService]);

  const showStreakWarning = useCallback(async (habitName, streakCount) => {
    return notificationService.showStreakWarning(habitName, streakCount);
  }, [notificationService]);

  const showDailySummary = useCallback(async (completedCount, totalCount, points) => {
    return notificationService.showDailySummary(completedCount, totalCount, points);
  }, [notificationService]);

  const playSound = useCallback((type = 'default') => {
    notificationService.playNotificationSound(type);
  }, [notificationService]);

  const toggleSound = useCallback((enabled) => {
    notificationService.toggleSound(enabled);
    setSoundEnabled(enabled);
  }, [notificationService]);

  return {
    isPermissionGranted,
    soundEnabled,
    requestPermission,
    showHabitReminder,
    showAchievementNotification,
    showStreakWarning,
    showDailySummary,
    playSound,
    toggleSound,
    isSupported: notificationService.isSupported
  };
};