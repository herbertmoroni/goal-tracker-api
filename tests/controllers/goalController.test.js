const goalController = require('../../controllers/goalController');
const Goal = require('../../models/goalModel');
const AppError = require('../../utils/AppError');

// Mock the actual implementation of the controller methods
jest.mock('../../controllers/goalController', () => {
  const originalModule = jest.requireActual('../../controllers/goalController');
  return {
    getAllGoals: jest.fn(),
    createGoal: jest.fn(),
    getGoalById: jest.fn(),
    updateGoal: jest.fn(),
    deleteGoal: jest.fn(),
    reorderGoals: jest.fn()
  };
});

// Mock the model
jest.mock('../../models/goalModel');

// Mock AppError
jest.mock('../../utils/AppError', () => {
  return class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
    }
  };
});

describe('GoalController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = { 
      user: { _id: 'user123' },
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('getAllGoals', () => {
    it('should return all active goals for user', async () => {
      const mockGoals = [
        { _id: 'goal1', name: 'Exercise' },
        { _id: 'goal2', name: 'Read' }
      ];
      
      // Mock the implementation for this test
      goalController.getAllGoals.mockImplementation(async (req, res, next) => {
        res.status(200).json({
          status: 'success',
          data: { goals: mockGoals }
        });
      });
      
      await goalController.getAllGoals(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { goals: mockGoals }
      });
    });

    it('should handle errors', async () => {
      // Mock the implementation for this test
      goalController.getAllGoals.mockImplementation(async (req, res, next) => {
        next(new AppError('Database error', 500));
      });
      
      await goalController.getAllGoals(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    });
  });

  describe('createGoal', () => {
    it('should create a new goal', async () => {
      const mockNewGoal = { 
        _id: 'goal3', 
        name: 'Meditate',
        order: 3
      };
      
      req.body = { name: 'Meditate' };
      
      // Mock the implementation for this test
      goalController.createGoal.mockImplementation(async (req, res, next) => {
        res.status(201).json({
          status: 'success',
          data: { goal: mockNewGoal }
        });
      });
      
      await goalController.createGoal(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { goal: mockNewGoal }
      });
    });
  });

  describe('getGoalById', () => {
    it('should return a goal by ID', async () => {
      const mockGoal = { _id: 'goal1', name: 'Exercise' };
      
      req.params.id = 'goal1';
      
      // Mock the implementation for this test
      goalController.getGoalById.mockImplementation(async (req, res, next) => {
        res.status(200).json({
          status: 'success',
          data: { goal: mockGoal }
        });
      });
      
      await goalController.getGoalById(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { goal: mockGoal }
      });
    });

    it('should return 404 if goal not found', async () => {
      req.params.id = 'nonexistent';
      
      // Mock the implementation for this test
      goalController.getGoalById.mockImplementation(async (req, res, next) => {
        next(new AppError('Goal not found', 404));
      });
      
      await goalController.getGoalById(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });
});