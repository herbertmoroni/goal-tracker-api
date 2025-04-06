const checkController = require('../../controllers/checkController');
const Check = require('../../models/checkModel');
const Goal = require('../../models/goalModel');
const AppError = require('../../utils/AppError');

// Mock the controller methods
jest.mock('../../controllers/checkController', () => {
  return {
    getWeekChecks: jest.fn(),
    toggleCheck: jest.fn(),
    getChecksByDate: jest.fn(),
    deleteCheck: jest.fn()
  };
});

// Mock models
jest.mock('../../models/checkModel');
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

describe('CheckController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = { 
      user: { _id: 'user123' },
      body: {},
      params: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('getWeekChecks', () => {
    it('should return checks for the current week', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          weekStart: new Date(),
          weekEnd: new Date(),
          checks: [
            {
              goalId: 'goal1',
              goalName: 'Exercise',
              dates: {}
            }
          ]
        }
      };

      // Mock controller method
      checkController.getWeekChecks.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await checkController.getWeekChecks(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('toggleCheck', () => {
    it('should toggle a check for an existing goal', async () => {
      req.params = {
        goalId: 'goal1',
        date: '2023-03-25'
      };
      
      const mockResponse = {
        status: 'success',
        data: {
          check: {
            id: 'check1',
            goalId: 'goal1',
            date: new Date('2023-03-25'),
            completed: false
          }
        }
      };
      
      // Mock controller method
      checkController.toggleCheck.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await checkController.toggleCheck(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should create a new check if one does not exist', async () => {
      req.params = {
        goalId: 'goal1',
        date: '2023-03-25'
      };
      
      const mockResponse = {
        status: 'success',
        data: {
          check: {
            id: 'check1',
            goalId: 'goal1',
            date: new Date('2023-03-25'),
            completed: true
          }
        }
      };
      
      // Mock controller method
      checkController.toggleCheck.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await checkController.toggleCheck(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
    
    it('should return 404 if goal not found', async () => {
      req.params = {
        goalId: 'nonexistent',
        date: '2023-03-25'
      };
      
      // Mock controller method
      checkController.toggleCheck.mockImplementation((req, res, next) => {
        next(new AppError('Goal not found', 404));
      });
      
      await checkController.toggleCheck(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('getChecksByDate', () => {
    it('should return checks for a specific date', async () => {
      req.params = {
        date: '2023-03-25'
      };
      
      const mockResponse = {
        status: 'success',
        data: {
          date: new Date('2023-03-25'),
          checks: [
            {
              goalId: 'goal1',
              goalName: 'Exercise',
              completed: true
            }
          ]
        }
      };
      
      // Mock controller method
      checkController.getChecksByDate.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await checkController.getChecksByDate(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('deleteCheck', () => {
    it('should delete a check successfully', async () => {
      req.params = {
        id: 'check1'
      };
      
      const mockResponse = {
        status: 'success',
        message: 'Check deleted successfully'
      };
      
      // Mock controller method
      checkController.deleteCheck.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await checkController.deleteCheck(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
    
    it('should return 404 if check not found', async () => {
      req.params = {
        id: 'nonexistent'
      };
      
      // Mock controller method
      checkController.deleteCheck.mockImplementation((req, res, next) => {
        next(new AppError('Check not found', 404));
      });
      
      await checkController.deleteCheck(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });
});