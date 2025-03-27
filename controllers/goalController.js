const goalService = require('../services/goalService');
const AppError = require('../utils/AppError');

class GoalController {
  async getAllGoals(req, res, next) {
    try {
      const goals = await goalService.getAllActiveGoals(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: {
          goals
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async createGoal(req, res, next) {
    try {
      const goal = await goalService.createGoal(req.user._id, req.body);
      
      res.status(201).json({
        status: 'success',
        data: {
          goal
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async getGoalById(req, res, next) {
    try {
      const goal = await goalService.getGoalById(req.params.id, req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: {
          goal
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateGoal(req, res, next) {
    try {
      const goal = await goalService.updateGoal(req.params.id, req.user._id, req.body);
      
      res.status(200).json({
        status: 'success',
        data: {
          goal
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteGoal(req, res, next) {
    try {
      const result = await goalService.deleteGoal(req.params.id, req.user._id);
      
      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }

  async reorderGoals(req, res, next) {
    try {
      const result = await goalService.reorderGoals(req.user._id, req.body.goals);
      
      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new GoalController();