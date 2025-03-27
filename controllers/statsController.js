const statsService = require('../services/statsService');

class StatsController {
  async getDashboardStats(req, res, next) {
    try {
      const result = await statsService.getDashboardStats(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async getStreaks(req, res, next) {
    try {
      const result = await statsService.getStreaks(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async getScores(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const result = await statsService.getScores(req.user._id, startDate, endDate);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new StatsController();