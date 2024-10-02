const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true }, // Changed 'name' to 'username' to match your DB
  password: { type: String, required: true }, // Plain passwords shouldn't be stored; hashed before saving
  email: { type: String, required: true, unique: true, lowercase: true }, // Ensure emails are case-insensitive
  role: { type: String, enum: ["student", "teacher", "admin"], required: true }, // User roles enum
});

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create a method to compare password with hashed password in DB
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
