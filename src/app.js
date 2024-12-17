// app.js

// Import dependencies
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './config/db.js'; // MongoDB connection
import errorHandler from './middlewares/errorHandler.js';

// Route imports
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/user-routes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import prizesRoutes from './routes/prizeRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';

// Initialize app
dotenv.config(); // Load environment variables
const app = express();

// Connect to the database
connectDB();
console.log('Connected to the database');

// Security middleware
app.use(helmet());         // Set security-related HTTP headers
app.use(mongoSanitize());  // Sanitize user input to prevent NoSQL injection attacks
app.use(xss());            // Sanitize user input to prevent XSS attacks
app.use(express.json({ limit: '10mb' }));

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes 
  max: 100,                  // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(morgan('dev'));

// API routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/prizes', prizesRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/campaigns', campaignRoutes);

// Custom error handling middleware
app.use(errorHandler);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Threat Intelligence Platform API');
});

// Export Express app as a Vercel-compatible function
import { createServer } from 'http';
import { parse } from 'url';

export default function handler(req, res) {
  const server = createServer(app);
  const parsedUrl = parse(req.url, true);
  server.emit('request', req, res);
}
