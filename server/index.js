const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Parse JSON request bodies safely.
app.use(express.json({ limit: '100kb' }));

// Simple health endpoint for local/cloud deployment checks.
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// REST API routes.
app.use('/api/tasks', taskRoutes);

// Unknown routes and centralized error handling.
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is required');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Successfully connected to MongoDB');

  const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

module.exports = app;
