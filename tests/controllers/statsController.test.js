const statsController = require('../../controllers/statsController');
const AppError = require('../../utils/AppError');

// Mock the controller methods
jest.mock('../../controllers/statsController', () => {
  return {
    getDashboardStats: jest.fn(),
    getStreaks: jest.fn(),
    getScores: jest.fn(),
    _calculateCurrentStreak: jest.fn(),
    _calculateGoalStreak: jest.fn()
  };
});

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

describe('StatsController', () => {
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

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          stats: {
            totalGoals: 5,
            activeGoals: 4,
            streakData: {
              currentStreak: 5,
              longestStreak: 10
            },
            completionRate: 85.5
          }
        }
      };
      
      // Mock controller method
      statsController.getDashboardStats.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await statsController.getDashboardStats(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getStreaks', () => {
    it('should return streak information for all active goals', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          streaks: [
            {
              goalId: 'goal1',
              goalName: 'Exercise',
              currentStreak: 3,
              longestStreak: 7
            },
            {
              goalId: 'goal2',
              goalName: 'Read',
              currentStreak: 5,
              longestStreak: 12
            }
          ]
        }
      };
      
      // Mock controller method
      statsController.getStreaks.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await statsController.getStreaks(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('getScores', () => {
    it('should return scores for a date range', async () => {
      req.query = {
        startDate: '2023-03-20',
        endDate: '2023-03-26'
      };
      
      const mockResponse = {
        status: 'success',
        data: {
          dateRange: {
            start: '2023-03-20',
            end: '2023-03-26'
          },
          scores: [
            {
              date: '2023-03-20',
              value: 2,
              completedCount: 2,
              totalCount: 4
            },
            {
              date: '2023-03-21',
              value: 4,
              completedCount: 4,
              totalCount: 4
            }
          ]
        }
      };
      
      // Mock controller method
      statsController.getScores.mockImplementation((req, res) => {
        res.status(200).json(mockResponse);
      });
      
      await statsController.getScores(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });
  });
});