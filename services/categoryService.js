const Category = require('../models/categoryModel');
const Goal = require('../models/goalModel');
const AppError = require('../utils/AppError');

class CategoryService {
  async getAllCategories(userId) {
    const categories = await Category.find({ 
      user: userId 
    }).sort({ order: 1 });
    
    return categories;
  }

  async createCategory(userId, categoryData) {
    const { name, color } = categoryData;
    
    // Check if category with this name already exists for user
    const existingCategory = await Category.findOne({
      user: userId,
      name: name
    });
    
    if (existingCategory) {
      throw new AppError(`A category with name "${name}" already exists`, 400);
    }
    
    // Get highest order number to place new category at the end
    const lastCategory = await Category.findOne({ 
      user: userId 
    }).sort({ order: -1 });
    
    const order = lastCategory ? lastCategory.order + 1 : 0;
    
     const category = await Category.create({
      user: userId,
      name,
      color: color || '#3498db',
      order
    });
    
    return category;
  }

  async getCategoryById(categoryId, userId) {
    const category = await Category.findOne({ 
      _id: categoryId,
      user: userId 
    });
    
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    
    return category;
  }

  async updateCategory(categoryId, userId, updateData) {

    const updateFields = {};
    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.color !== undefined) updateFields.color = updateData.color;
    if (updateData.order !== undefined) updateFields.order = updateData.order;
    
    const category = await Category.findOneAndUpdate(
      { 
        _id: categoryId,
        user: userId 
      },
      updateFields,
      { 
        new: true,  // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    
    return category;
  }

  async deleteCategory(categoryId, userId) {

    const category = await Category.findOne({ 
      _id: categoryId,
      user: userId 
    });
    
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    
    // Check if any goals are using this category
    const goalsUsingCategory = await Goal.countDocuments({
      user: userId,
      category: categoryId
    });
    
    if (goalsUsingCategory > 0) {
       throw new AppError('Cannot delete category that has goals assigned to it', 400);
    }
    
    await Category.findByIdAndDelete(categoryId);
    
    // Reorder remaining categories to maintain consistent ordering
    await Category.updateMany(
      { 
        user: userId,
        order: { $gt: category.order }
      },
      { 
        $inc: { order: -1 } 
      }
    );
    
    return { 
      message: 'Category deleted successfully',
      affectedGoals: goalsUsingCategory
    };
  }
}

module.exports = new CategoryService();