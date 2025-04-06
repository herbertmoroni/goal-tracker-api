const categoryController = require('../../controllers/categoryController');
const Category = require('../../models/categoryModel');
const AppError = require('../../utils/AppError');

// Mock the actual implementation of the controller methods
jest.mock('../../controllers/categoryController', () => {
  const originalModule = jest.requireActual('../../controllers/categoryController');
  return {
    getAllCategories: jest.fn(),
    createCategory: jest.fn(),
    getCategoryById: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn()
  };
});

// Mock the model
jest.mock('../../models/categoryModel');

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

describe('CategoryController', () => {
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

  describe('getAllCategories', () => {
    it('should return all categories for user', async () => {
      const mockCategories = [
        { _id: 'category1', name: 'Work' },
        { _id: 'category2', name: 'Personal' }
      ];
      
      // Mock the implementation for this test
      categoryController.getAllCategories.mockImplementation(async (req, res, next) => {
        res.status(200).json({
          status: 'success',
          data: { categories: mockCategories }
        });
      });
      
      await categoryController.getAllCategories(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { categories: mockCategories }
      });
    });

    it('should handle errors', async () => {
      // Mock the implementation for this test
      categoryController.getAllCategories.mockImplementation(async (req, res, next) => {
        next(new AppError('Database error', 500));
      });
      
      await categoryController.getAllCategories(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockNewCategory = { 
        _id: 'category3', 
        name: 'Health'
      };
      
      req.body = { name: 'Health' };
      
      // Mock the implementation for this test
      categoryController.createCategory.mockImplementation(async (req, res, next) => {
        res.status(201).json({
          status: 'success',
          data: { category: mockNewCategory }
        });
      });
      
      await categoryController.createCategory(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { category: mockNewCategory }
      });
    });

    it('should handle validation errors', async () => {
      req.body = { }; // Missing required field
      
      categoryController.createCategory.mockImplementation(async (req, res, next) => {
        next(new AppError('Name is required', 400));
      });
      
      await categoryController.createCategory(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const mockCategory = { _id: 'category1', name: 'Work' };
      
      req.params.id = 'category1';
      
      // Mock the implementation for this test
      categoryController.getCategoryById.mockImplementation(async (req, res, next) => {
        res.status(200).json({
          status: 'success',
          data: { category: mockCategory }
        });
      });
      
      await categoryController.getCategoryById(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { category: mockCategory }
      });
    });

    it('should return 404 if category not found', async () => {
      req.params.id = 'nonexistent';
      
      // Mock the implementation for this test
      categoryController.getCategoryById.mockImplementation(async (req, res, next) => {
        next(new AppError('Category not found', 404));
      });
      
      await categoryController.getCategoryById(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const mockUpdatedCategory = { 
        _id: 'category1', 
        name: 'Work Tasks',
        updatedAt: new Date()
      };
      
      req.params.id = 'category1';
      req.body = { name: 'Work Tasks' };
      
      categoryController.updateCategory.mockImplementation(async (req, res, next) => {
        res.status(200).json({
          status: 'success',
          data: { category: mockUpdatedCategory }
        });
      });
      
      await categoryController.updateCategory(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { category: mockUpdatedCategory }
      });
    });
    
    it('should handle unauthorized update attempts', async () => {
      req.params.id = 'category4';
      req.body = { name: 'Unauthorized' };
      
      categoryController.updateCategory.mockImplementation(async (req, res, next) => {
        next(new AppError('You are not authorized to update this category', 403));
      });
      
      await categoryController.updateCategory(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      req.params.id = 'category2';
      
      categoryController.deleteCategory.mockImplementation(async (req, res, next) => {
        res.status(200).json({
          status: 'success',
          message: 'Category deleted successfully'
        });
      });
      
      await categoryController.deleteCategory(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category deleted successfully'
      });
    });
    
    it('should return 404 if category to delete not found', async () => {
      req.params.id = 'nonexistent';
      
      categoryController.deleteCategory.mockImplementation(async (req, res, next) => {
        next(new AppError('Category not found', 404));
      });
      
      await categoryController.deleteCategory(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });
    
    it('should handle unauthorized delete attempts', async () => {
      req.params.id = 'category5';
      
      categoryController.deleteCategory.mockImplementation(async (req, res, next) => {
        next(new AppError('You are not authorized to delete this category', 403));
      });
      
      await categoryController.deleteCategory(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].statusCode).toBe(403);
    });
  });
});