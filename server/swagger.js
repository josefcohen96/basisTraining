const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'API Documentation',
  },
  host: 'localhost:5000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';

// Add all your route and controller files
const endpointsFiles = [
  './server.js',
  './routes/authRoutes.js',
  './routes/adminRoutes.js',
  './routes/courseRoutes.js',
  './routes/workoutRoutes.js',
  './routes/nutritionPlanRoutes.js',
  './routes/trackingRoutes.js',
  './controllers/authController.js',
  './controllers/adminController.js',
  './controllers/courseController.js',
  './controllers/workoutController.js',
  './controllers/nutritionPlanController.js',
  './controllers/trackingController.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc);
