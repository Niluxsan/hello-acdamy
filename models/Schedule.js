const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schedule Schema Definition
const ScheduleSchema = new Schema({
  className: {
    type: String,
    required: true,
    trim: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming 'User' is the model for teachers
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Use string for time (HH:MM format)
    required: true,
  },
  endTime: {
    type: String, // Use string for time (HH:MM format)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = mongoose.model("Schedule", ScheduleSchema);
