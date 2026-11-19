const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true,
    // ✅ Updated branches with CSE-AI and CSE-DS
    enum: ['CSE', 'CSE-AI', 'CSE-DS', 'ECE', 'ME', 'CE', 'EE', 'IT']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);