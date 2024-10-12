const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  }, // Username for login
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please provide a valid email address"], // Basic email format validation
  },
  grades: [
    {
      teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
      }, // Reference to the teacher
      subject: {
        type: String,
        required: [true, "Subject is required"],
      },
      grade: {
        type: String,
        required: [true, "Grade is required"],
      },
      comment: {
        type: String,
        required: [true, "Comment is required"],
      },
    },
  ],
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: [true, "Role is required"],
  }, // Define user roles
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Track creation time
  updatedAt: {
    type: Date,
    default: Date.now,
  }, // Track last update time
});

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's new or modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to update 'updatedAt' field automatically
UserSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Export the User model
const User = mongoose.model("User", UserSchema);
module.exports = User;
