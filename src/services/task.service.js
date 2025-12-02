import Task from '../models/Task.model.js';

class TaskService {
  
  // Create new task. Task number is auto-generated in model.
  async createTask(taskData, userId) {
    const task = await Task.create({
      ...taskData,
      userId,
      completed: false
    });

    return task
  }

  // Get all tasks for a specific user. Optional filter by completed status.
  async getUserTasks(userId, filters ={}) {
    const query = { userId };

    // FIlter by completed status if provided
    if (filters.completed !== undefined) {
      query.completed = filters.completed == 'true';
    }

    const tasks = await Task.find(query).sort({ taskNumber: 1 })
    return tasks
  }

  // Get single task by taskNumber
  async getTaskByNumber(taskNumber, userId) {
    const task = await Task.findOne({ taskNumber, userId })

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    return task;
  }

  // Update a task by taskNumber
  async updateTask(taskNumber, userId, updates) {
    const task = await Task.findOne( {taskNumber, userId })

    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    // Update only provided fields
    Object.assign(task, updates);
    await task.save();

    return task;
  }

  // Deleta a task by taskNumber
  async deleteTask(taskNumber, userId) {
    const result = await Task.deleteOne({ taskNumber, userId })
  
    if (result.deletedCount === 0) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    return { message: 'Task deleted successfully' }
  }
}

export default new TaskService();
