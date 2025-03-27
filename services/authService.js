const admin = require('firebase-admin');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

class AuthService {
  async registerUser(email, password, displayName) {
    if (!email || !password || !displayName) {
      throw new AppError('Please provide email, password and displayName', 400);
    }
    
    // Create user in Firebase
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
    
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName
      }
    };
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }
    
    try {
      // Get the user by email from Firebase
      const userRecord = await admin.auth().getUserByEmail(email);
      
      // Get user from MongoDB
      const user = await User.findOne({ firebaseUid: userRecord.uid });
      
      if (!user) {
        throw new AppError('User not found in database', 404);
      }
      
      // Generate a custom token
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      
      // Update last login
      await User.findOneAndUpdate(
        { firebaseUid: userRecord.uid },
        { lastLogin: new Date() }
      );
      
      return {
        token: customToken,
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName
        }
      };
    } catch (error) {
      throw new AppError('Invalid credentials', 401);
    }
  }
  
  async getUserById(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return {
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };
  }
}

module.exports = new AuthService();