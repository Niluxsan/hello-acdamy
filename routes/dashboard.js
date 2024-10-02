const express = require("express");
const router = express.Router();
const authMiddleware = require("./../authMiddleware");

// Dashboard Route
router.get("/dashboard", authMiddleware, (req, res) => {
  const role = req.user.role; // Get user role from the decoded token

  // Redirect based on user role
  switch (role) {
    case "student":
      return res.redirect("/student-dashboard");
    case "teacher":
      return res.redirect("/teacher-dashboard");
    case "admin":
      return res.redirect("/admin-dashboard");
    default:
      return res.status(403).json({ msg: "Access denied: Invalid role" }); // Invalid role
  }
});

// Export the router
module.exports = router;
