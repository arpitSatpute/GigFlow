import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
// import gigRoutes from './routes/gigs.js';
// import bidRoutes from './routes/bids.js';
import { errorHandler } from './middleware/errorHandler.js';

// Loading the env file
dotenv.config();

// Conneting Mongo DB via Mongoose 
connectDB();

const app = express();


// Middleware nad cors handling
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
// app.use('/api/gigs', gigRoutes);
// app.use('/api/bids', bidRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});