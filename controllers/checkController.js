const checkService = require('../services/checkService');

class CheckController {
  async getWeekChecks(req, res, next) {
    try {
      const result = await checkService.getWeekChecks(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  async toggleCheck(req, res, next) {
    try {
      const { goalId, date } = req.params;
      const check = await checkService.toggleCheck(req.user._id, goalId, date);
      
      res.status(200).json({
        status: 'success',
        data: {
          check
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async getChecksByDate(req, res, next) {
    try {
      const result = await checkService.getChecksByDate(req.user._id, req.params.date);
      
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CheckController();