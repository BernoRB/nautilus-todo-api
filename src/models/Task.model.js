import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskNumber: {
    type: Number,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  responsible: {
    type: String,
    trim: true,
    maxlength: [100, 'Responsible cannot exceed 100 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia a modelo User por si se necesitase hacer populate, ej "const task = await Task.findOne({ taskNumber: 1, userId }).populate('userId');"
    required: true
  }
}, {
  timestamps: true
});

// Unique compound index: each user has its own sequence
taskSchema.index({ userId: 1, taskNumber: 1 }, { unique: true });

// Index for listing tasks by user // unused right now, could delete
taskSchema.index({ userId: 1, createdAt: -1 });

// Auto-increment taskNumber before save (only for new tasks)
taskSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastTask = await mongoose.model('Task')
      .findOne({ userId: this.userId })
      .sort({ taskNumber: -1 })
      .select('taskNumber');
    
    this.taskNumber = lastTask ? lastTask.taskNumber + 1 : 1;
  }
});

export default mongoose.model('Task', taskSchema);