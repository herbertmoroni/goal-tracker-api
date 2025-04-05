const categoryService = require('../services/categoryService');

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const categories = await categoryService.getAllCategories(req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: {
          categories
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.user._id, req.body);
      
      res.status(201).json({
        status: 'success',
        data: {
          category
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id, req.user._id);
      
      res.status(200).json({
        status: 'success',
        data: {
          category
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.user._id, req.body);
      
      res.status(200).json({
        status: 'success',
        data: {
          category
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const result = await categoryService.deleteCategory(req.params.id, req.user._id);
      
      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CategoryController();