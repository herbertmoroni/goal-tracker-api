const Stat = require('../models/statModel');
const Goal = require('../models/goalModel');
const Check = require('../models/checkModel');
const AppError = require('../utils/AppError');

class StatsService {
  async getDashboardStats(userId) {
    // Get total goals count
    const totalGoals = await Goal.countDocuments({ user: userId });
    
    // Get active goals count
    const activeGoals = await Goal.countDocuments({ 
      user: userId,
      active: true 
    });
    
    // Calculate today's date and previous dates for streak calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate completion rate over the past 30 days
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const activeGoalsData = await Goal.find({ 
      user: userId, 
      active: true 
    });
    
    // If no active goals, set rate to 0
    let completionRate = 0;
    
    if (activeGoalsData.length > 0) {
      // Get all checks for active goals in the past 30 days
      const checks = await Check.find({
        user: userId,
        goal: { $in: activeGoalsData.map(g => g._id) },
        date: { $gte: thirtyDaysAgo, $lte: today },
        completed: true
      });
      
      // Calculate the number of possible checks (goals × days)
      const possibleChecks = activeGoalsData.length * 30;
      
      // Calculate completion rate as percentage
      completionRate = (checks.length / possibleChecks) * 100;
    }
    
    // Calculate current streak
    const streak = await this._calculateCurrentStreak(userId);
    
    // Get longest streak
    const longestStat = await Stat.findOne({
      user: userId,
      type: 'streak'
    }).sort({ value: -1 });
    
    const longestStreak = longestStat ? longestStat.value : 0;
    
    // Update streak stat if current streak is the longest
    if (streak > longestStreak) {
      await Stat.findOneAndUpdate(
        { user: userId, type: 'streak' },
        { 
          user: userId,
          type: 'streak',
          date: new Date(),
          value: streak
        },
        { upsert: true, new: true }
      );
    }
    
    return {
      stats: {
        totalGoals,
        activeGoals,
        streakData: {
          currentStreak: streak,
          longestStreak
        },
        completionRate: Math.round(completionRate * 10) / 10 // Round to 1 decimal place
      }
    };
  }

  async getStreaks(userId) {
    // Get all active goals
    const goals = await Goal.find({
      user: userId,
      active: true
    });
    
    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For each goal, calculate the current and longest streak
    const streakPromises = goals.map(async goal => {
      // Get current streak
      const currentStreak = await this._calculateGoalStreak(userId, goal._id);
      
      // Get longest streak for this goal from stats
      const longestStat = await Stat.findOne({
        user: userId,
        goal: goal._id,
        type: 'streak'
      }).sort({ value: -1 });
      
      const longestStreak = longestStat ? longestStat.value : 0;
      
      return {
        goalId: goal._id,
        goalName: goal.name,
        currentStreak,
        longestStreak
      };
    });
    
    const streaks = await Promise.all(streakPromises);
    
    return { streaks };
  }

  async getScores(userId, startDate, endDate) {
    // Set time components for the date range
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    // Get all active goals
    const goals = await Goal.find({
      user: userId,
      active: true
    });
    
    // Generate all dates in the range
    const dateRange = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // For each date, calculate the score
    const scorePromises = dateRange.map(async date => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Get all completed checks for the day
      const completedChecks = await Check.find({
        user: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
        completed: true
      }).populate('goal', 'points positive');
      
      // Calculate score based on goal points
      let score = 0;
      completedChecks.forEach(check => {
        if (check.goal) {
          score += check.goal.points * (check.goal.positive ? 1 : -1);
        }
      });
      
      return {
        date: startOfDay.toISOString().split('T')[0], // Format as YYYY-MM-DD
        value: score,
        completedCount: completedChecks.length,
        totalCount: goals.length
      };
    });
    
    const scores = await Promise.all(scorePromises);
    
    return {
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      },
      scores
    };
  }

  // Helper methods for streak calculations
  async _calculateCurrentStreak(userId) {
    try {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get yesterday's date
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      // Get all active goals
      const activeGoals = await Goal.find({
        user: userId,
        active: true
      });
      
      if (activeGoals.length === 0) {
        return 0; // No active goals, no streak
      }
      
      // Optimize by getting a date range of checks for the past 30 days
      // (most streaks won't be longer than this, and we can fetch in one query)
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const recentChecks = await Check.find({
        user: userId,
        date: { $gte: thirtyDaysAgo, $lte: today },
        completed: true
      });
      
      // Group checks by date for faster lookups
      const checksByDate = {};
      recentChecks.forEach(check => {
        const dateStr = check.date.toISOString().split('T')[0];
        if (!checksByDate[dateStr]) {
          checksByDate[dateStr] = [];
        }
        checksByDate[dateStr].push(check);
      });
      
      // Helper to check if all goals are completed for a day
      const areAllGoalsCompleted = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return checksByDate[dateStr] && checksByDate[dateStr].length >= activeGoals.length;
      };
      
      // Check if today is completed
      const isTodayCompleted = areAllGoalsCompleted(today);
      
      // Start from yesterday or today depending on whether today is completed
      let currentDate = isTodayCompleted ? today : yesterday;
      let streak = isTodayCompleted ? 1 : 0;
      
      // Keep checking backwards until a day with incomplete goals is found
      while (true) {
        if (streak > 0 && !isTodayCompleted) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // If we've already counted today and are checking yesterday or earlier
        const isCurrentDayCompleted = areAllGoalsCompleted(currentDate);
        
        if (!isCurrentDayCompleted) {
          break;
        }
        
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
        
        // Safety check - if we go back more than 30 days, we need to fetch more data
        if (currentDate < thirtyDaysAgo) {
          // At this point, would need to fetch more data - but for simplicity
          // we'll just return the 30-day streak as that's impressive enough
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  async _calculateGoalStreak(userId, goalId) {
    try {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get yesterday's date
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      // Helper to check if goal is completed for a day
      const isGoalCompleted = async (date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Check if goal was completed on this day
        const check = await Check.findOne({
          user: userId,
          goal: goalId,
          date: { $gte: startOfDay, $lte: endOfDay }
        });
        
        return check?.completed || false;
      };
      
      // Check if today is completed
      const isTodayCompleted = await isGoalCompleted(today);
      
      // Start from yesterday or today depending on whether today is completed
      let currentDate = isTodayCompleted ? today : yesterday;
      let streak = isTodayCompleted ? 1 : 0;
      
      // Keep checking backwards until a day with incomplete goal is found
      while (true) {
        if (streak > 0 && !isTodayCompleted) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // If we've already counted today and are checking yesterday or earlier
        const isCurrentDayCompleted = await isGoalCompleted(currentDate);
        
        if (!isCurrentDayCompleted) {
          break;
        }
        
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating goal streak:', error);
      return 0;
    }
  }
}

module.exports = new StatsService();