import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : {}));
app.use(express.json());
app.use(logger);
app.get('/api/health', (req, res) => res.json({ success: true, message: 'ShelfLife API is running' }));
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api', borrowRoutes);
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('MONGO_URI and JWT_SECRET must be configured in .env');
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI).then(() => app.listen(port, () => console.log(`ShelfLife API listening on port ${port}`))).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
