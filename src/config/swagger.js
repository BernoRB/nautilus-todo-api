import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nautilus TODO API',
      version: '1.0.0',
      description: 'Task management API with Node.js, Express, MongoDB and JWT authentication',
      contact: {
        name: 'Bernabe Rodriguez',
        email: 'bernabrb@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Auth Schemas
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            name: {
              type: 'string',
              minLength: 2,
              example: 'John Doe'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'User registered successfully'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        // Task Schemas
        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              example: 'Complete project documentation'
            },
            description: {
              type: 'string',
              maxLength: 500,
              example: 'Write comprehensive README and API docs'
            },
            responsible: {
              type: 'string',
              maxLength: 100,
              example: 'John Doe'
            }
          }
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              example: 'Updated task title'
            },
            description: {
              type: 'string',
              maxLength: 500,
              example: 'Updated description'
            },
            responsible: {
              type: 'string',
              maxLength: 100,
              example: 'Jane Smith'
            },
            completed: {
              type: 'boolean',
              example: true
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            taskNumber: {
              type: 'integer',
              example: 1
            },
            title: {
              type: 'string',
              example: 'Complete project documentation'
            },
            description: {
              type: 'string',
              example: 'Write comprehensive README and API docs'
            },
            responsible: {
              type: 'string',
              example: 'John Doe'
            },
            completed: {
              type: 'boolean',
              example: false
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-01T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-01T10:00:00.000Z'
            }
          }
        },
        TaskListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            count: {
              type: 'integer',
              example: 2
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Task'
              }
            }
          }
        },
        TaskResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Task created successfully'
            },
            data: {
              $ref: '#/components/schemas/Task'
            }
          }
        },
        // Error Schemas
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Validation error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Please provide a valid email'
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Not authorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Not authorized. No token provided.'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Task not found'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;