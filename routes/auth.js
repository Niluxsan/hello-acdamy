const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Sign-In Route
router.post("/signin", async (req, res) => {
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

    // Send role along with success message
    res.status(200).json({ msg: "Sign-in successful", role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const { username, password, role, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      email,
    });
    console.log(newUser);
    await newUser.save();
    console.log(newUser);
    res.status(201).json({ msg: "User created" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
