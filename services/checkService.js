const Check = require('../models/checkModel');
const Goal = require('../models/goalModel');
const AppError = require('../utils/AppError');

class CheckService {
  async getWeekChecks(userId) {
    // Calculate start and end dates for current week (Sunday to Saturday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    // Find all checks for the week
    const checks = await Check.find({
      user: userId,
      date: { 
        $gte: startDate,
        $lte: endDate
      }
    }).populate({
      path: 'goal',
      select: 'name icon points positive'
    });
    
    // Get all active goals to ensure we return data for all goals
    const activeGoals = await Goal.find({
      user: userId,
      active: true
    });
    
    // Create a map of dates for the week
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    
    // Organize checks by goal and date
    const checksByGoal = {};
    
    // Initialize with all active goals
    activeGoals.forEach(goal => {
      checksByGoal[goal._id] = {
        goalId: goal._id,
        goalName: goal.name,
        goalIcon: goal.icon,
        goalPoints: goal.points,
        goalPositive: goal.positive,
        dates: {}
      };
      
      // Initialize with all dates in the week
      weekDates.forEach(date => {
        checksByGoal[goal._id].dates[date] = {
          date,
          completed: false,
          checkId: null
        };
      });
    });
    
    // Fill in the actual check data
    checks.forEach(check => {
      const dateStr = check.date.toISOString().split('T')[0];
      const goalId = check.goal._id.toString();
      
      if (checksByGoal[goalId] && checksByGoal[goalId].dates[dateStr]) {
        checksByGoal[goalId].dates[dateStr] = {
          date: dateStr,
          completed: check.completed,
          checkId: check._id
        };
      }
    });
    
    return {
      weekStart: startDate,
      weekEnd: endDate,
      checks: Object.values(checksByGoal)
    };
  }

  async toggleCheck(userId, goalId, date) {
    // Set the time to start of day for consistency
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Verify goal belongs to user
    const goal = await Goal.findOne({
      _id: goalId,
      user: userId
    });
    
    if (!goal) {
      throw new AppError('Goal not found', 404);
    }
    
    // Check if a check already exists for this goal and date
    const existingCheck = await Check.findOne({
      goal: goalId,
      user: userId,
      date: checkDate
    });
    
    let check;
    
    if (existingCheck) {
      // Toggle the completed status
      existingCheck.completed = !existingCheck.completed;
      check = await existingCheck.save();
    } else {
      // Create a new check (defaults to completed: true)
      check = await Check.create({
        goal: goalId,
        user: userId,
        date: checkDate,
        completed: true
      });
    }
    
    return {
      id: check._id,
      goalId,
      date: check.date,
      completed: check.completed
    };
  }

  async getChecksByDate(userId, date) {
    // Set start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find all checks for the date
    const checks = await Check.find({
      user: userId,
      date: { 
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate({
      path: 'goal',
      select: 'name icon points positive'
    });
    
    // Get all active goals for this user
    const activeGoals = await Goal.find({
      user: userId,
      active: true
    });
    
    // Prepare response data
    const checksData = activeGoals.map(goal => {
      const check = checks.find(c => c.goal._id.toString() === goal._id.toString());
      
      return {
        goalId: goal._id,
        goalName: goal.name,
        goalIcon: goal.icon,
        goalPoints: goal.points,
        goalPositive: goal.positive,
        date: date,
        completed: check ? check.completed : false,
        checkId: check ? check._id : null
      };
    });
    
    return {
      date: startOfDay,
      checks: checksData
    };
  }

  async deleteCheck(userId, checkId) {
    // Find the check
    const check = await Check.findOne({
      _id: checkId,
      user: userId
    });
    
    if (!check) {
      throw new AppError('Check not found', 404);
    }
    
    // Delete the check
    await Check.deleteOne({ _id: checkId });
    
    return true;
  }
}

module.exports = new CheckService();