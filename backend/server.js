import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import gigRoutes from './routes/gigs.js';
import bidRoutes from './routes/bids.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Loading the env file
dotenv.config();

// Conneting Mongo DB via Mongoose 
connectDB();

const app = express();


// Middleware nad cors handling
app.use(cors({
  origin: 'https://gig-flow-iota.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Backend Applications routes

app.get('/', (req, res) => {
  res.json({ message: 'GigFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// --- Socket.io Integration ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their own room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Change app.listen to httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});