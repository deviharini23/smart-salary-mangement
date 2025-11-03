// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionString = 'mongodb+srv://deviharinipolisetty_db_user:XTDWjlRXpWuA8jHp@cluster0.5mi3ypl.mongodb.net/expenses_tracker?retryWrites=true&w=majority';
    
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Connected successfully to Expenses Tracker');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;