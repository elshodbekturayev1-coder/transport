/**
 * MongoDB connection config
 * Uses MONGO_URI from .env or falls back to local
 */
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transport_db';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  MongoDB connected:', MONGO_URI);
  } catch (err) {
    console.warn('⚠️   MongoDB not available — running in mock/memory mode');
    // App continues working with in-memory mock data
  }
}

module.exports = { connectDB, MONGO_URI };
