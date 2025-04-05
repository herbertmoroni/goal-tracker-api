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

  async updateDisplayName(req, res, next) {
    try {
      const { displayName } = req.body;
      
      if (!displayName) {
        return next(new AppError('Please provide a display name', 400));
      }
      
      // Update user in database
      const user = await authService.updateDisplayName(req.user._id, displayName);
      
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
  
  async deleteUser(req, res, next) {
    try {
      const result = await authService.deleteUser(req.user._id);
      
      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = new AuthController();