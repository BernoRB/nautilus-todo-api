import { body, param, validationResult } from 'express-validator';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required') // Pone mensaje de error para la validacion inmediatamente anterior
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('responsible')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Responsible cannot exceed 100 characters')
  ]

  export const updateTaskValidation = [
    param('taskNumber')
      .isInt({ min: 1 })
      .withMessage('Invalid task number'),

    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
    
    body('responsible')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Responsible cannot exceed 100 characters'),
    
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be a boolean')
  ];

  export const taskNumberValidation = [
    param('taskNumber')
      .isInt({ min: 1 })
      .withMessage('Invalid task number')
  ];

  export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    next();
  };