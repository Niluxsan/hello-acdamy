const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true }, // Username for login
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/, // Basic email format validation
  },
  grades: [
    {
      teacher: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the teacher
      subject: { type: String, required: true },
      grade: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
  role: { type: String, enum: ["student", "teacher", "admin"], required: true }, // Define user roles
  createdAt: { type: Date, default: Date.now }, // Track creation time
  updatedAt: { type: Date, default: Date.now },
  // Track last update time
});

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
const User = mongoose.model("User", UserSchema);
module.exports = User;
