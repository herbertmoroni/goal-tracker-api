const authController = require('../../controllers/authController');
const User = require('../../models/userModel');
const AppError = require('../../utils/AppError');

// Create mock functions
const mockCreateUser = jest.fn();
const mockCreateCustomToken = jest.fn();

// Mock modules
jest.mock('../../models/userModel', () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

jest.mock('firebase-admin', () => ({
  auth: () => ({
    createUser: mockCreateUser,
    createCustomToken: mockCreateCustomToken,
    getUserByEmail: jest.fn()
  })
}));

describe('AuthController - Register', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 400 if email is missing', async () => {
    req.body = { password: 'password123', displayName: 'Test User' };
    
    await authController.register(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should return 400 if password is missing', async () => {
    req.body = { email: 'test@example.com', displayName: 'Test User' };
    
    await authController.register(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should return 400 if displayName is missing', async () => {
    req.body = { email: 'test@example.com', password: 'password123' };
    
    await authController.register(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  it('should create a user and return 201 with token', async () => {
    const mockFirebaseUid = 'firebase-uid-123';
    const mockMongoId = 'mongo-id-123';
    const mockToken = 'token-123';
    
    req.body = { 
      email: 'test@example.com', 
      password: 'password123', 
      displayName: 'Test User' 
    };
    
    // Setup return values for mocks
    mockCreateUser.mockResolvedValue({ uid: mockFirebaseUid });
    mockCreateCustomToken.mockResolvedValue(mockToken);
    
    User.create.mockResolvedValue({
      _id: mockMongoId,
      email: 'test@example.com',
      displayName: 'Test User'
    });
    
    // Call the controller
    await authController.register(req, res, next);
    
    // Check Firebase interactions
    expect(mockCreateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User'
    });
    
    // Check MongoDB interactions
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      firebaseUid: mockFirebaseUid,
      email: 'test@example.com'
    }));
    
    // Check response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      token: mockToken
    }));
  });

  it('should handle Firebase errors', async () => {
    req.body = { 
      email: 'test@example.com', 
      password: 'password123', 
      displayName: 'Test User' 
    };
    
    // Setup mock to throw error
    const error = new Error('Firebase error');
    mockCreateUser.mockRejectedValue(error);
    
    // Call the controller
    await authController.register(req, res, next);
    
    // Check error handling
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});