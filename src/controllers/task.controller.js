import taskService from "../services/task.service.js";

// Create a new task
// POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const { title, description, responsible } = req.body;
    const userId = req.user._id;

    const task = await taskService.createTask(
      { title, description, responsible },
      userId
    )

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// Get all tasks for authenticated user
// GET /api/tasks
// Query params: ?completed=true (optional)
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const filters = {
      completed: req.query.completed
    };

    const tasks = await taskService.getUserTasks(userId, filters)

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// Get single task by taskNumber
// GET /api/tasks/:taskNumber
export const getTask = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const taskNumber = parseInt(req.params.taskNumber);

    const task = await taskService.getTaskByNumber(taskNumber, userId)

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

// Update a task by taskNUmber
// PATCH /api/tasks/:taskNumber
export const updateTask = async (req, res, next) => {
  try {
    const taskNumber = parseInt(req.params.taskNumber);
    const userId = req.user._id;
    const updates = req.body;

    const task = await taskService.updateTask(taskNumber, userId, updates);
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task by taskNUmber
// DELETE /api/tasks/:taskNumber
export const deleteTask = async (req, res, next) => {
  try {
    const taskNumber = parseInt(req.params.taskNumber);
    const userId = req.user._id;

    const result = await taskService.deleteTask(taskNumber, userId);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
