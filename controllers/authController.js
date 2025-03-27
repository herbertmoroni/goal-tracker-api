const authService = require('../services/authService');
const AppError = require('../utils/AppError');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, displayName } = req.body;
      
      const result = await authService.registerUser(email, password, displayName);
      
      res.status(201).json({
        status: 'success',
        token: result.token,
        data: {
          user: result.user
        }
      });
    } catch (error) {
      return next(error);
    }
  }
  
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.loginUser(email, password);
      
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        tokenType: 'Bearer',
        token: result.token,
        usage: 'Add this token to the Authorize button in Swagger',
        data: {
          user: result.user
        }
      });
    } catch (error) {
      return next(error);
    }
  }
    
  async getCurrentUser(req, res, next) {
    try {
      // req.user is set by authenticate middleware
      const userId = req.user._id;
      
      const user = await authService.getUserById(userId);
      
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();