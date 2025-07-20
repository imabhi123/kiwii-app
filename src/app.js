// server.js
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/user-routes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import prizesRoutes from './routes/prizeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { createServer } from 'http';
import socketService from './services/notificationService.js';

dotenv.config();

const app = express();
// Replace current socket initialization with:
const server = createServer(app);
const io = socketService.initialize(server);
app.set('socketService', socketService);

connectDB();

app.use(mongoSanitize());
app.use(xss());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
});

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://kiwii.shop'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// app.use(limiter);
app.use(cors(corsOptions));
app.use(morgan('dev')); 

console.log(process.env.MONGODB_URI,'--->uri');

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/prizes', prizesRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/messages', messageRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Welcome to the Threat Intelligence Platform API');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
