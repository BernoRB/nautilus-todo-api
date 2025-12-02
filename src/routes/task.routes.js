import express from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask,  } from '../controllers/task.controller.js';
import { createTaskValidation, updateTaskValidation, taskNumberValidation, handleValidationErrors } from '../validators/task.validator.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ALl routes require authentication (middleware protect)
router.use(protect)

// Create new task
// POST /api/tasks
router.post(
  '/',
  createTaskValidation,
  handleValidationErrors,
  createTask
)

// Get all tasks for authenticated user
// GET /api/tasks - Query params: ?completed=true (optional)
router.get('/', getTasks)

// Get single task by taskNumber
// GET /api/tasks/:taskNumber
router.get(
  '/:taskNumber',
  taskNumberValidation,
  handleValidationErrors,
  getTask
)

// Update a task by taskNUmber
// PATCH /api/tasks/:taskNumber
router.patch(
  '/:taskNumber',
  updateTaskValidation,
  handleValidationErrors,
  updateTask
)

// Delete a task by taskNUmber
// DELETE /api/tasks/:taskNumber
router.delete(
  '/:taskNumber',
  taskNumberValidation,
  handleValidationErrors,
  deleteTask
)


export default router;