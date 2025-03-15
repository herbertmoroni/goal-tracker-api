const admin = require('firebase-admin');
const User = require('../models/userModel');

class AuthController {
  
  async register(req, res) {
    try {
      const { email, password, displayName } = req.body;
      
      if (!email || !password || !displayName) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Please provide email, password and displayName' 
        });
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
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }

    
  async getCurrentUser(req, res) {
    try {
      // For testing - return dummy user
      const dummyUser = {
        _id: "5f8d0f55e3a9d93f9810c9a1",
        firebaseUid: "dummy-firebase-uid-123",
        email: "chuck.norris@example.com",
        displayName: "Chuck Norris",
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: dummyUser._id,
            email: dummyUser.email,
            displayName: dummyUser.displayName
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: error.message 
      });
    }
  }
  
  
}

module.exports = new AuthController();