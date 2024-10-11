const mongoose = require("mongoose");

// Define the schema for grades associated with a student
const gradeSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (teacher)
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    grade: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    comment: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Define the schema for students
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model for student account linkage
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    grades: [gradeSchema], // Array of grades associated with the student
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the Student model
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
