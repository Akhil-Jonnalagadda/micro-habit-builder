// Notification utility with sound support
export class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.soundEnabled = true;
    
    // Create audio context for notification sounds
    this.audioContext = null;
    this.initAudio();
  }

  async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  // Play notification sound
  playNotificationSound(type = 'default') {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      // Create different sounds for different notification types
      const sounds = {
        default: { frequency: 800, duration: 0.3 },
        reminder: { frequency: 600, duration: 0.5 },
        achievement: { frequency: 1000, duration: 0.7 },
        warning: { frequency: 400, duration: 0.4 }
      };

      const sound = sounds[type] || sounds.default;
      this.beep(sound.frequency, sound.duration);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  // Generate beep sound
  beep(frequency, duration) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Show notification with sound
  async showNotification(title, options = {}, soundType = 'default') {
    // Play sound first
    this.playNotificationSound(soundType);

    // Show browser notification if permission granted
    if (await this.requestPermission()) {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }

    return null;
  }

  // Habit reminder notification
  async showHabitReminder(habitName, streakCount = 0) {
    const title = "🎯 Habit Reminder";
    const body = streakCount > 0 
      ? `Time to complete "${habitName}"! Keep your ${streakCount}-day streak going! 🔥`
      : `Time to complete "${habitName}"! Start building your streak! 💪`;

    return this.showNotification(title, {
      body,
      tag: 'habit-reminder',
      requireInteraction: true,
      actions: [
        { action: 'complete', title: '✅ Mark Complete' },
        { action: 'snooze', title: '⏰ Remind in 10 min' }
      ]
    }, 'reminder');
  }

  // Achievement notification
  async showAchievementNotification(badgeName, description) {
    const title = "🏆 Achievement Unlocked!";
    const body = `You earned the "${badgeName}" badge! ${description}`;

    return this.showNotification(title, {
      body,
      tag: 'achievement',
      requireInteraction: true
    }, 'achievement');
  }

  // Streak warning notification
  async showStreakWarning(habitName, streakCount) {
    const title = "⚠️ Streak Alert";
    const body = `Don't lose your ${streakCount}-day streak for "${habitName}"! Complete it now to keep going.`;

    return this.showNotification(title, {
      body,
      tag: 'streak-warning',
      requireInteraction: true
    }, 'warning');
  }

  // Daily summary notification
  async showDailySummary(completedCount, totalCount, points) {
    const title = "📊 Daily Summary";
    const body = `You completed ${completedCount}/${totalCount} habits today and earned ${points} points! 🌟`;

    return this.showNotification(title, {
      body,
      tag: 'daily-summary'
    }, 'default');
  }

  // Enable/disable sound
  toggleSound(enabled) {
    this.soundEnabled = enabled;
  }

  // Check if notifications are supported and permitted
  isEnabled() {
    return this.isSupported && this.permission === 'granted';
  }
}