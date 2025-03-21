const admin = require('firebase-admin');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

class AuthController {
  
  async register(req, res, next) {
    try {
      const { email, password, displayName } = req.body;
      
      if (!email || !password || !displayName) {
        return next(new AppError('Please provide email, password and displayName', 400));
      }
      
      // Create user in Firebase (handles password hashing)
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName
      });
      
      // Create user in our database
      const user = await User.create({
        firebaseUid: userRecord.uid,
        email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      // Generate token
      const token = await admin.auth().createCustomToken(userRecord.uid);
      
      res.status(201).json({
        status: 'success',
        token,
        data: {
          user: {
            id: user._id,
            email: user.email,
            displayName: user.displayName
          }
        }
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }

    
  async getCurrentUser(req, res, next) {
    try {
      // req.user is set by authenticate middleware
      const user = req.user;
      
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
          }
        }
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }


  /**
   * Server-side login for testing with Swagger
   * Provides a Firebase ID token that can be used with the API
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
      }
      
      // Note: Firebase Admin SDK doesn't support email/password authentication directly
      // For testing purposes, we'll use an alternative approach:
      // 1. Find the user by email in our database
      // 2. Generate a custom token
      // 3. Exchange that for an ID token (simulating what the Firebase client SDK would do)
      
      try {
        // Get the user by email from Firebase
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Get user from MongoDB
        const user = await User.findOne({ firebaseUid: userRecord.uid });
        
        if (!user) {
          return next(new AppError('User not found in database', 404));
        }
        
        // Generate a custom token - this would normally be exchanged for an ID token
        // by the Firebase client SDK
        const customToken = await admin.auth().createCustomToken(userRecord.uid);
        
        // For testing purposes, we're treating this custom token as if it were an ID token
        // In a real scenario with a frontend, Firebase SDK would exchange this for an ID token
        
        // Update last login
        await User.findOneAndUpdate(
          { firebaseUid: userRecord.uid },
          { lastLogin: new Date() }
        );
        
        res.status(200).json({
          status: 'success',
          message: 'Login successful',
          // Instructions for Swagger testing
          tokenType: 'Bearer',
          token: customToken,
          usage: 'Add this token to the Authorize button in Swagger',
          data: {
            user: {
              id: user._id,
              email: user.email,
              displayName: user.displayName
            }
          }
        });
      } catch (error) {
        return next(new AppError('Invalid credentials', 401));
      }
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }
  
}

module.exports = new AuthController();