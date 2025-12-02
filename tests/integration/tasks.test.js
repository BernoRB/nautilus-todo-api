import request from 'supertest';
import app from '../../src/app.js';
import { connectDB, clearDB, closeDB } from '../setup.js';

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

// Helper function to register and login a user
const loginUser = async (email = 'test@example.com', password = 'password123') => {
  await request(app)
    .post('/api/auth/register')
    .send({
      email,
      password,
      name: 'Test User'
    });
  
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return response.body.data.token;
};

describe('Task Endpoints', () => {
  
  describe('POST /api/tasks', () => {
    
    it('should create a task successfully', async () => {
      const token = await loginUser();
      
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        responsible: 'John Doe'
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toHaveProperty('taskNumber', 1);
      expect(response.body.data).toHaveProperty('title', 'Test Task');
      expect(response.body.data).toHaveProperty('completed', false);
    });
    
    it('should not create task without authentication', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description'
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
    
    it('should validate required title', async () => {
      const token = await loginUser();
      
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No title'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
    });
    
    it('should validate title length', async () => {
      const token = await loginUser();
      
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'AB'
        })
        .expect(400);
      
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Title must be between 3 and 100 characters'
          })
        ])
      );
    });
    
    it('should auto-increment taskNumber for each user', async () => {
      const token = await loginUser();
      
      // Create first task
      const response1 = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 1' });
      
      // Create second task
      const response2 = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 2' });
      
      expect(response1.body.data.taskNumber).toBe(1);
      expect(response2.body.data.taskNumber).toBe(2);
    });
    
  });
  
  describe('GET /api/tasks', () => {
    
    it('should get all tasks for user', async () => {
      const token = await loginUser();
      
      // Create two tasks
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 1' });
      
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 2' });
      
      // Get all tasks
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });
    
    it('should not return tasks from other users', async () => {
      const token1 = await loginUser('user1@example.com');
      const token2 = await loginUser('user2@example.com');
      
      // User 1 creates a task
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token1}`)
        .send({ title: 'User 1 Task' });
      
      // User 2 gets their tasks (should be empty)
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);
      
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
    
    it('should filter completed tasks', async () => {
      const token = await loginUser();
      
      // Create completed task
      const task1 = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 1' });
      
      await request(app)
        .patch(`/api/tasks/${task1.body.data.taskNumber}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true });
      
      // Create pending task
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 2' });
      
      // Filter only completed
      const response = await request(app)
        .get('/api/tasks?completed=true')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].completed).toBe(true);
    });
    
  });
  
  describe('GET /api/tasks/:taskNumber', () => {
    
    it('should get single task by number', async () => {
      const token = await loginUser();
      
      // Create task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Task' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // Get task
      const response = await request(app)
        .get(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.taskNumber).toBe(taskNumber);
      expect(response.body.data.title).toBe('Test Task');
    });
    
    it('should return 404 for non-existent task', async () => {
      const token = await loginUser();
      
      const response = await request(app)
        .get('/api/tasks/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
    
    it('should not get task from another user', async () => {
      const token1 = await loginUser('user1@example.com');
      const token2 = await loginUser('user2@example.com');
      
      // User 1 creates task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token1}`)
        .send({ title: 'User 1 Task' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // User 2 tries to get it
      const response = await request(app)
        .get(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(404);
      
      expect(response.body.message).toBe('Task not found');
    });
    
  });
  
  describe('PATCH /api/tasks/:taskNumber', () => {
    
    it('should update task successfully', async () => {
      const token = await loginUser();
      
      // Create task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Original Title' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // Update task
      const response = await request(app)
        .patch(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Title' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
    });
    
    it('should mark task as completed', async () => {
      const token = await loginUser();
      
      // Create task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Task' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // Mark as completed
      const response = await request(app)
        .patch(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true })
        .expect(200);
      
      expect(response.body.data.completed).toBe(true);
    });
    
    it('should not update another users task', async () => {
      const token1 = await loginUser('user1@example.com');
      const token2 = await loginUser('user2@example.com');
      
      // User 1 creates task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token1}`)
        .send({ title: 'User 1 Task' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // User 2 tries to update it
      const response = await request(app)
        .patch(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ title: 'Hacked' })
        .expect(404);
      
      expect(response.body.message).toBe('Task not found');
    });
    
  });
  
  describe('DELETE /api/tasks/:taskNumber', () => {
    
    it('should delete task successfully', async () => {
      const token = await loginUser();
      
      // Create task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Task' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // Delete task
      const response = await request(app)
        .delete(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');
      
      // Verify it's deleted
      await request(app)
        .get(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
    
    it('should not delete another users task', async () => {
      const token1 = await loginUser('user1@example.com');
      const token2 = await loginUser('user2@example.com');
      
      // User 1 creates task
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token1}`)
        .send({ title: 'User 1 Task' });
      
      const taskNumber = createResponse.body.data.taskNumber;
      
      // User 2 tries to delete it
      const response = await request(app)
        .delete(`/api/tasks/${taskNumber}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(404);
      
      expect(response.body.message).toBe('Task not found');
    });
    
  });
  
});