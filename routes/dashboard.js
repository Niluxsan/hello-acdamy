const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Token is not valid" });
    req.user = decoded;
    next();
  });
};

// Dashboard Route
router.get("/dashboard", authMiddleware, (req, res) => {
  const role = req.user.role;
  switch (role) {
    case "student":
      res.redirect("/student-dashboard");
      break;
    case "teacher":
      res.redirect("/teacher-dashboard");
      break;
    case "admin":
      res.redirect("/admin-dashboard");
      break;
    default:
      res.status(403).json({ msg: "Access denied" });
  }
});

module.exports = router;
