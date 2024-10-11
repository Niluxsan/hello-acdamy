const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

// Check if JWT_SECRET is defined

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in .env file");
}

// Sign-In Route
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role }, // Payload with user ID and role
        process.env.JWT_SECRET, // Secret key from environment variables
        { expiresIn: "1h" } // Token expiry time (1 hour)
      );

      // Send token, user details (name, email, role) and success message
      res.status(200).json({
        msg: "Sign-in successful",
        token, // JWT token
        user: {
          name: user.username, // User's name
          email: user.email, // User's email
          role: user.role, // User's role
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Sign-Up Route
router.post(
  "/signup",
  [
    // Validation for incoming fields
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("username").notEmpty().withMessage("Username is required"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role, email, name } = req.body; // Include name from the request
    try {
      // Check if a user with this email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Create a new user instance
      const newUser = new User({
        username,
        password, // Password will be hashed in the schema pre-save hook
        role,
        email,
      });

      // Save the new user to the database
      await newUser.save();

      // Create the corresponding Student document
      const newStudent = new Student({
        userId: newUser._id, // Link to the user
        name, // This is the name provided by the student during signup
        email: newUser.email, // Copy email from user
        grades: {},
        comments: {},
      });

      await newStudent.save(); // Save the student document

      // Respond with a success message and the user details
      res.status(201).json({
        msg: "User and student created successfully 🎉",
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
