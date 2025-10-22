import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';

// Import routes
import authRoutes from './routes/auth';
import comidasRoutes from './routes/comidas';
import bebidasRoutes from './routes/bebidas';
import materialSalaRoutes from './routes/material-sala';
import studentsRoutes from './routes/students';
import servicesRoutes from './routes/services';
import quebrasRoutes from './routes/quebras';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/comidas', comidasRoutes);
app.use('/api/bebidas', bebidasRoutes);
app.use('/api/material-sala', materialSalaRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/quebras', quebrasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'RESTGEST API is running', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
