import taskService from '../../src/services/task.service.js';
import authService from '../../src/services/auth.service.js';
import { connectDB, clearDB, closeDB } from '../setup.js';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Task Service', () => {
  
  let userId;
  
  beforeEach(async () => {
    const user = await authService.register({
      email: 'taskuser@example.com',
      password: 'password123',
      name: 'Task User'
    });
    userId = user.user.id;
  });
  
  it('should create a task', async () => {
    const taskData = { title: 'Test Task' };
    
    const result = await taskService.createTask(taskData, userId);
    
    expect(result.title).toBe('Test Task');
    expect(result.completed).toBe(false);
    expect(result.taskNumber).toBe(1);
  });
  
  it('should get user tasks', async () => {
    await taskService.createTask({ title: 'Task 1' }, userId);
    await taskService.createTask({ title: 'Task 2' }, userId);
    
    const result = await taskService.getUserTasks(userId);
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Task 1');
    expect(result[1].title).toBe('Task 2');
  });
  
  it('should throw error if task not found', async () => {
    await expect(
      taskService.getTaskByNumber(999, userId)
    ).rejects.toThrow('Task not found');
  });
  
});