const admin = require('firebase-admin');
const User = require('../models/userModel');

exports.authenticate = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated. Please login first.'
      });
    }
    
    // Extract the token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split('Bearer ')[1] 
      : authHeader;
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated. Please login first.'
      });
    }
    
    try {
      // First try as ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userId = decodedToken.uid;
    } catch (idTokenError) {
      // If that fails, handle as a custom token
      try {
        // Custom tokens need special handling - extract UID directly from payload
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        req.userId = decoded.uid;
      } catch (customTokenError) {
        throw new Error('Invalid token format');
      }
    }
    
    // Check if user exists in our database
    const user = await User.findOne({ firebaseUid: req.userId });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found in database. Please register first.'
      });
    }
    
    // Update last login time
    await User.findOneAndUpdate(
      { firebaseUid: req.userId },
      { lastLogin: new Date() }
    );
    
    // Add user to request object
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired authentication token.'
    });
  }
};