const express = require("express");
const router = express.Router();
const authMiddleware = require("./../authMiddleware");
// Dashboard Route
router.get("/dashboard", authMiddleware, (req, res) => {
  const role = req.user.role; // Get user role from decoded token

  // Redirect based on user role
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
      res.status(403).json({ msg: "Access denied" }); // Invalid role
  }
});

// Export the router
module.exports = router;
