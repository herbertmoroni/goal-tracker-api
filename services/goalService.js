const Goal = require('../models/goalModel');
const AppError = require('../utils/AppError');

class GoalService {
  async getAllActiveGoals(userId) {
    const goals = await Goal.find({ 
      user: userId,
      active: true 
    }).sort({ order: 1 });
    
    return goals;
  }

  async createGoal(userId, goalData) {
    const { name, icon, positive, points } = goalData;
    
    // Get highest order number to place new goal at the end
    const lastGoal = await Goal.findOne({ 
      user: userId 
    }).sort({ order: -1 });
    
    const order = lastGoal ? lastGoal.order + 1 : 0;
    
    // Create new goal
    const goal = await Goal.create({
      user: userId,
      name,
      icon: icon || 'check-circle',
      positive: positive !== undefined ? positive : true,
      points: points || 1,
      category: category || null,
      order,
      active: true
    });
    
    return goal;
  }

  async getGoalById(goalId, userId) {
    const goal = await Goal.findOne({ 
      _id: goalId,
      user: userId 
    });
    
    if (!goal) {
      throw new AppError('Goal not found', 404);
    }
    
    return goal;
  }

  async updateGoal(goalId, userId, updateData) {
    // Create update object with only fields that are present
    const updateFields = {};
    if (updateData.name !== undefined) updateFields.name = updateData.name;
    if (updateData.icon !== undefined) updateFields.icon = updateData.icon;
    if (updateData.positive !== undefined) updateFields.positive = updateData.positive;
    if (updateData.points !== undefined) updateFields.points = updateData.points;
    if (updateData.active !== undefined) updateFields.active = updateData.active;
    if (updateData.category !== undefined) updateFields.category = updateData.category;
    
    // Find and update the goal
    const goal = await Goal.findOneAndUpdate(
      { 
        _id: goalId,
        user: userId 
      },
      updateFields,
      { 
        new: true,  // Return updated document
        runValidators: true  // Run schema validators
      }
    );
    
    if (!goal) {
      throw new AppError('Goal not found', 404);
    }
    
    return goal;
  }

  async deleteGoal(goalId, userId) {
    // Find and delete the goal
    const goal = await Goal.findOneAndDelete({ 
      _id: goalId,
      user: userId 
    });
    
    if (!goal) {
      throw new AppError('Goal not found', 404);
    }
    
    // Reorder remaining goals to maintain consistent ordering
    await Goal.updateMany(
      { 
        user: userId,
        order: { $gt: goal.order }
      },
      { 
        $inc: { order: -1 } 
      }
    );
    
    return { message: 'Goal deleted successfully' };
  }

  async reorderGoals(userId, goalsData) {
    const goalIds = goalsData.map(g => g.id);
    
    // Validate that all goals belong to the user
    const userGoals = await Goal.find({
      _id: { $in: goalIds },
      user: userId
    });
    
    if (userGoals.length !== goalIds.length) {
      throw new AppError('Some goals do not exist or do not belong to you', 404);
    }
    
    // Update order of each goal
    const updatePromises = goalsData.map(({ id, order }) => 
      Goal.findByIdAndUpdate(id, { order })
    );
    
    await Promise.all(updatePromises);
    
    return { message: 'Goals reordered successfully' };
  }
}

module.exports = new GoalService();