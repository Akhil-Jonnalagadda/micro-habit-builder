import React from 'react';
import { useHabits } from '../context/HabitContext';

const Heatmap = ({ habitId, year = new Date().getFullYear() }) => {
  const { getHabitCompletions, darkMode } = useHabits();
  
  const completions = getHabitCompletions(habitId);
  
  // Generate calendar data for the year
  const generateCalendarData = () => {
    const data = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCompleted = completions[dateStr] || false;
      
      data.push({
        date: dateStr,
        count: isCompleted ? 1 : 0,
        dateObj: new Date(currentDate)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const calendarData = generateCalendarData();
  
  // Group data by weeks
  const groupByWeeks = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Add empty days at the beginning if the year doesn't start on Sunday
    const firstDay = calendarData[0]?.dateObj.getDay() || 0;
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }
    
    calendarData.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7 || index === calendarData.length - 1) {
        // Fill the rest of the week with null if needed
        while (currentWeek.length < 7) {
          currentWeek.push(null);
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeks;
  };

  const weeks = groupByWeeks();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCellColor = (count) => {
    if (darkMode) {
      return count > 0 
        ? 'bg-green-400 dark:bg-green-500' 
        : 'bg-gray-200 dark:bg-gray-700';
    }
    return count > 0 
      ? 'bg-green-300' 
      : 'bg-gray-100';
  };

  const getMonthLabels = () => {
    const labels = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      week.forEach((day) => {
        if (day && day.dateObj.getMonth() !== currentMonth) {
          currentMonth = day.dateObj.getMonth();
          if (day.dateObj.getDate() <= 7) { // Only show if it's early in the month
            labels.push({
              month: currentMonth,
              weekIndex: weekIndex,
              name: monthNames[currentMonth]
            });
          }
        }
      });
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Heatmap {year}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 dark:bg-green-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 dark:bg-green-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Month labels */}
            <div className="flex mb-2" style={{ paddingLeft: '24px' }}>
              {monthLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400"
                  style={{ 
                    position: 'absolute',
                    left: `${24 + label.weekIndex * 12}px`,
                    width: '36px'
                  }}
                >
                  {label.name}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col mr-2">
                {dayNames.map((day, index) => (
                  <div
                    key={day}
                    className={`h-3 flex items-center text-xs text-gray-600 dark:text-gray-400 ${
                      index % 2 === 0 ? '' : 'invisible'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex space-x-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${
                          day 
                            ? `${getCellColor(day.count)} hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-600 cursor-pointer transition-all`
                            : 'bg-transparent'
                        }`}
                        title={day ? `${day.date}: ${day.count > 0 ? 'Completed' : 'Not completed'}` : ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Total: {calendarData.filter(day => day.count > 0).length} days
          </span>
          <span>
            Current streak: {getCurrentStreak()}
          </span>
        </div>
      </div>
    </div>
  );

  function getCurrentStreak() {
    const today = new Date();
    let streak = 0;
    let date = new Date(today);

    while (date) {
      const dateStr = date.toISOString().split('T')[0];
      if (completions[dateStr]) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
};

export default Heatmap;