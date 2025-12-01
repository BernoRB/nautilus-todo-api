import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.middleware.js';
import authRoutes from './routes/auth.routes.js';
// import taskRoutes from './routes/task.routes.js'; TO DO
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('dev'));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Nautilus TODO APi running',
    timestamp: new Date().toISOString(),
  })
})

// API Routes TO DO
app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use(errorHandler);

export default app;