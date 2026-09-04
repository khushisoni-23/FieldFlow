const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FieldFlow Backend API',
      version: '1.0.0',
      description: 'Comprehensive REST API documentation for the FieldFlow Field Service Management SaaS platform.\n\n### Authentication\nMost endpoints require JWT Bearer Authentication. Obtain a token via `/api/auth/login` or `/api/auth/register` and click the **Authorize** button above to supply `Bearer <token>`.',
      contact: {
        name: 'FieldFlow Support',
        url: 'https://field-flow-pi.vercel.app'
      }
    },
    servers: [
      {
        url: 'https://field-flow-pi.vercel.app',
        description: 'Live Production Server'
      },
      {
        url: process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 5001}`,
        description: 'Current API Server'
      },
      {
        url: 'http://localhost:5001',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Resource not found or validation error message'
            },
            stack: {
              type: 'string',
              description: 'Included only in development environment'
            }
          }
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'USR-101' },
            name: { type: 'string', example: 'Alex Morgan' },
            email: { type: 'string', format: 'email', example: 'admin@fieldflow.io' },
            role: { type: 'string', enum: ['ADMIN', 'TECHNICIAN'], example: 'ADMIN' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
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
              example: 'admin@fieldflow.io'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'admin123'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@fieldflow.io'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'secret123'
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'TECHNICIAN'],
              example: 'ADMIN'
            },
            specialization: {
              type: 'string',
              example: 'HVAC Specialist',
              description: 'Optional specialization if role is TECHNICIAN'
            }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'CUST-1001' },
            name: { type: 'string', example: 'Metro Hospital' },
            phone: { type: 'string', example: '+1 (555) 234-5678' },
            email: { type: 'string', format: 'email', example: 'facilities@metrohospital.org' },
            address: { type: 'string', example: '450 Healthcare Blvd' },
            city: { type: 'string', example: 'Metro City' },
            state: { type: 'string', example: 'CA' },
            pincode: { type: 'string', example: '90001' },
            notes: { type: 'string', example: 'Access via rear loading dock' },
            status: { type: 'string', example: 'Active' },
            serviceCount: { type: 'integer', example: 12 },
            lastService: { type: 'string', example: '2026-08-15' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CustomerInput: {
          type: 'object',
          required: ['name', 'phone', 'address'],
          properties: {
            name: { type: 'string', example: 'Metro Hospital' },
            phone: { type: 'string', example: '+1 (555) 234-5678' },
            email: { type: 'string', format: 'email', example: 'facilities@metrohospital.org' },
            address: { type: 'string', example: '450 Healthcare Blvd' },
            city: { type: 'string', example: 'Metro City' },
            state: { type: 'string', example: 'CA' },
            pincode: { type: 'string', example: '90001' },
            notes: { type: 'string', example: 'Access via rear loading dock' }
          }
        },
        CustomerUpdateInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Metro Hospital Updated' },
            phone: { type: 'string', example: '+1 (555) 234-5678' },
            email: { type: 'string', format: 'email', example: 'facilities@metrohospital.org' },
            address: { type: 'string', example: '450 Healthcare Blvd' },
            status: { type: 'string', example: 'Active' }
          }
        },
        Technician: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'TECH-101' },
            userId: { type: 'string', example: 'USR-102' },
            name: { type: 'string', example: 'Marcus Vance' },
            phone: { type: 'string', example: '+1 (555) 890-1234' },
            email: { type: 'string', format: 'email', example: 'marcus@fieldflow.io' },
            avatar: { type: 'string', example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
            specialization: { type: 'string', example: 'HVAC & Refrigeration' },
            skills: {
              type: 'array',
              items: { type: 'string' },
              example: ['HVAC', 'Compressors', 'Electrical Wiring']
            },
            status: {
              type: 'string',
              enum: ['Available', 'On Job', 'Busy', 'Offline'],
              example: 'Available'
            },
            rating: { type: 'number', format: 'float', example: 4.9 },
            assignedJobsCount: { type: 'integer', example: 3 },
            completedJobsCount: { type: 'integer', example: 45 },
            workload: { type: 'integer', example: 60 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        TechnicianInput: {
          type: 'object',
          required: ['name', 'specialization', 'phone', 'email'],
          properties: {
            name: { type: 'string', example: 'Marcus Vance' },
            specialization: { type: 'string', example: 'HVAC & Refrigeration' },
            phone: { type: 'string', example: '+1 (555) 890-1234' },
            email: { type: 'string', format: 'email', example: 'marcus@fieldflow.io' }
          }
        },
        TechnicianStatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['Available', 'On Job', 'Busy', 'Offline'],
              example: 'Busy'
            }
          }
        },
        PartsUsedEntry: {
          type: 'object',
          required: ['partId', 'partName', 'quantity', 'price'],
          properties: {
            partId: { type: 'string', example: 'INV-101' },
            partName: { type: 'string', example: 'Compressor Valve 12mm' },
            quantity: { type: 'number', example: 2 },
            price: { type: 'number', example: 45.00 }
          }
        },
        TimelineEntry: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'In Progress' },
            time: { type: 'string', example: '2026-09-04 14:30' },
            note: { type: 'string', example: 'Technician arrived on site' }
          }
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'JOB-2001' },
            customerId: { type: 'string', example: 'CUST-1001' },
            customerName: { type: 'string', example: 'Metro Hospital' },
            customerPhone: { type: 'string', example: '+1 (555) 234-5678' },
            serviceType: { type: 'string', example: 'HVAC Repair' },
            problemDescription: { type: 'string', example: 'Main chiller unit failing to maintain temperature' },
            address: { type: 'string', example: '450 Healthcare Blvd' },
            priority: {
              type: 'string',
              enum: ['Low', 'Normal', 'Medium', 'High', 'Urgent'],
              example: 'High'
            },
            scheduledDate: { type: 'string', example: '2026-09-05' },
            scheduledTime: { type: 'string', example: '10:00 AM' },
            technicianId: { type: 'string', nullable: true, example: 'TECH-101' },
            technicianName: { type: 'string', example: 'Marcus Vance' },
            serviceCharge: { type: 'number', example: 120.00 },
            partsCost: { type: 'number', example: 90.00 },
            totalAmount: { type: 'number', example: 210.00 },
            status: {
              type: 'string',
              enum: ['Pending', 'Assigned', 'On The Way', 'Arrived', 'In Progress', 'Completed', 'Delayed', 'Paid'],
              example: 'Pending'
            },
            paymentStatus: {
              type: 'string',
              enum: ['Pending', 'Paid'],
              example: 'Pending'
            },
            paymentMethod: { type: 'string', example: 'Credit Card' },
            notes: { type: 'string', example: 'Urgent medical wing temperature control' },
            partsUsed: {
              type: 'array',
              items: { $ref: '#/components/schemas/PartsUsedEntry' }
            },
            beforePhoto: { type: 'string', nullable: true, example: null },
            afterPhoto: { type: 'string', nullable: true, example: null },
            timeline: {
              type: 'array',
              items: { $ref: '#/components/schemas/TimelineEntry' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        JobInput: {
          type: 'object',
          required: ['customerId', 'serviceType', 'problemDescription', 'priority', 'scheduledDate', 'scheduledTime'],
          properties: {
            customerId: { type: 'string', example: 'CUST-1001' },
            serviceType: { type: 'string', example: 'HVAC Repair' },
            problemDescription: { type: 'string', example: 'Chiller unit error code E-402' },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High', 'Urgent'],
              example: 'High'
            },
            scheduledDate: { type: 'string', example: '2026-09-05' },
            scheduledTime: { type: 'string', example: '10:00 AM' },
            technicianId: { type: 'string', example: 'TECH-101' },
            address: { type: 'string', example: '450 Healthcare Blvd' },
            notes: { type: 'string', example: 'Security check at building A' }
          }
        },
        JobStatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['Pending', 'Assigned', 'On The Way', 'Arrived', 'In Progress', 'Completed', 'Delayed', 'Paid'],
              example: 'In Progress'
            },
            noteText: {
              type: 'string',
              example: 'Disassembled pump casing for inspection'
            }
          }
        },
        JobCompleteInput: {
          type: 'object',
          required: ['serviceCharge'],
          properties: {
            serviceCharge: { type: 'number', example: 150.00 },
            partsUsed: {
              type: 'array',
              items: { $ref: '#/components/schemas/PartsUsedEntry' }
            },
            notes: { type: 'string', example: 'Replaced seals and tested pressure' },
            paymentStatus: {
              type: 'string',
              enum: ['Pending', 'Paid'],
              example: 'Paid'
            },
            paymentMethod: { type: 'string', example: 'Cash' },
            beforePhoto: { type: 'string', example: 'https://example.com/photos/before.jpg' },
            afterPhoto: { type: 'string', example: 'https://example.com/photos/after.jpg' }
          }
        },
        JobPaymentInput: {
          type: 'object',
          required: ['amount'],
          properties: {
            method: { type: 'string', example: 'Credit Card' },
            paymentMethod: { type: 'string', example: 'Credit Card' },
            amount: { type: 'number', example: 210.00 }
          }
        },
        JobAssignInput: {
          type: 'object',
          required: ['technicianId'],
          properties: {
            technicianId: { type: 'string', example: 'TECH-101' }
          }
        },
        JobPartsInput: {
          type: 'object',
          required: ['partId', 'partName', 'quantity', 'price'],
          properties: {
            partId: { type: 'string', example: 'INV-101' },
            partName: { type: 'string', example: 'Thermostat Valve' },
            quantity: { type: 'number', example: 1 },
            price: { type: 'number', example: 45.00 }
          }
        },
        JobPhotosInput: {
          type: 'object',
          properties: {
            beforePhoto: { type: 'string', example: 'https://example.com/photos/before.jpg' },
            afterPhoto: { type: 'string', example: 'https://example.com/photos/after.jpg' }
          }
        },
        InventoryItem: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'INV-101' },
            partName: { type: 'string', example: 'Compressor Valve 12mm' },
            sku: { type: 'string', example: 'SKU-CP-1200' },
            category: { type: 'string', example: 'HVAC Parts' },
            stock: { type: 'integer', example: 35 },
            minStock: { type: 'integer', example: 10 },
            price: { type: 'number', example: 45.00 },
            status: { type: 'string', example: 'In Stock' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        InventoryInput: {
          type: 'object',
          required: ['category'],
          properties: {
            partName: { type: 'string', example: 'Compressor Valve 12mm' },
            name: { type: 'string', example: 'Compressor Valve 12mm' },
            sku: { type: 'string', example: 'SKU-CP-1200' },
            category: { type: 'string', example: 'HVAC Parts' },
            stock: { type: 'number', example: 35 },
            quantity: { type: 'number', example: 35 },
            minStock: { type: 'number', example: 10 },
            reorderLevel: { type: 'number', example: 10 },
            price: { type: 'number', example: 45.00 },
            unitPrice: { type: 'number', example: 45.00 }
          }
        },
        StockUpdateInput: {
          type: 'object',
          properties: {
            stockCount: { type: 'number', example: 50 },
            quantity: { type: 'number', example: 50 },
            quantityChange: { type: 'number', example: 50 }
          }
        },
        StockDeductInput: {
          type: 'object',
          required: ['quantity'],
          properties: {
            quantity: { type: 'integer', minimum: 1, example: 2 }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'PAY-3001' },
            jobId: { type: 'string', example: 'JOB-2001' },
            customerName: { type: 'string', example: 'Metro Hospital' },
            amount: { type: 'number', example: 210.00 },
            paymentMethod: { type: 'string', example: 'Credit Card' },
            status: { type: 'string', example: 'Paid' },
            date: { type: 'string', example: '2026-09-04' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        PaymentInput: {
          type: 'object',
          required: ['jobId', 'customerName', 'amount'],
          properties: {
            jobId: { type: 'string', example: 'JOB-2001' },
            customerName: { type: 'string', example: 'Metro Hospital' },
            amount: { type: 'number', example: 210.00 },
            paymentMethod: { type: 'string', example: 'Credit Card' },
            status: { type: 'string', enum: ['Pending', 'Paid'], example: 'Paid' },
            date: { type: 'string', example: '2026-09-04' }
          }
        },
        PaymentStatusUpdate: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['Pending', 'Paid'], example: 'Paid' },
            method: { type: 'string', example: 'UPI / Online' }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'NOTIF-4001' },
            title: { type: 'string', example: 'Job Completed' },
            message: { type: 'string', example: 'Job JOB-2001 has been marked as Completed.' },
            time: { type: 'string', example: '5 minutes ago' },
            read: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        NotificationInput: {
          type: 'object',
          required: ['title', 'message'],
          properties: {
            title: { type: 'string', example: 'Job Completed' },
            message: { type: 'string', example: 'Job JOB-2001 has been marked as Completed.' },
            time: { type: 'string', example: 'Just now' }
          }
        },
        SearchResponse: {
          type: 'object',
          properties: {
            query: { type: 'string', example: 'Metro' },
            results: {
              type: 'object',
              properties: {
                customers: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Customer' }
                },
                jobs: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Job' }
                },
                technicians: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Technician' }
                },
                inventory: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/InventoryItem' }
                }
              }
            }
          }
        },
        AnalyticsResponse: {
          type: 'object',
          properties: {
            totalJobs: { type: 'integer', example: 128 },
            completedJobs: { type: 'integer', example: 98 },
            pendingJobs: { type: 'integer', example: 18 },
            activeTechnicians: { type: 'integer', example: 12 },
            totalRevenue: { type: 'number', example: 45200.00 },
            lowStockItems: { type: 'integer', example: 4 },
            jobStatusBreakdown: {
              type: 'object',
              additionalProperties: { type: 'integer' },
              example: { Pending: 10, Assigned: 8, Completed: 98, InProgress: 12 }
            },
            monthlyRevenue: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  month: { type: 'string', example: 'Aug 2026' },
                  revenue: { type: 'number', example: 14500.00 }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, '../app.js').replace(/\\/g, '/'),
    path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec
};
