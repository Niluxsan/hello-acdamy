const express = require("express");
const router = express.Router();
const authMiddleware = require("./../authMiddleware");
const User = require("./../models/User");
const Schedule = require("./../models/Schedule");

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

// Admin Routes

// View All Users
router.get("/admin/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.render("admin/users", { users }); // Render users in the admin view
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Edit User Details (GET)
router.get("/admin/users/edit/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by ID
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.render("admin/editUser", { user }); // Render edit user form
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Edit User Details (POST)
router.post("/admin/users/edit/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body); // Update user in the database
    res.redirect("/admin/users"); // Redirect to user list
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Delete User
router.delete("/admin/users/delete/:id", authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // Delete user by ID
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" }); // Return success message
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// View All Class Schedules
router.get("/admin/schedules", authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("teacher", "name"); // Fetch class schedules with teacher name
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Add New Schedule (POST)
router.post("/admin/schedules/add", authMiddleware, async (req, res) => {
  try {
    const { className, teacher, date, startTime, endTime } = req.body;

    // Validate required fields
    if (!className || !teacher || !date || !startTime || !endTime) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields" });
    }

    const newSchedule = new Schedule({
      className,
      teacher,
      date,
      startTime,
      endTime,
    }); // Create a new schedule instance

    await newSchedule.save(); // Save schedule to the database
    res.status(201).json({ message: "Schedule added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Edit Schedule (GET)
router.get("/admin/schedules/edit/:id", authMiddleware, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id); // Find schedule by ID
    if (!schedule) {
      return res.status(404).send("Schedule not found");
    }
    res.render("admin/editSchedule", { schedule }); // Render edit schedule form
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Edit Schedule (POST)
router.post("/admin/schedules/edit/:id", authMiddleware, async (req, res) => {
  try {
    const { className, teacher, date, startTime, endTime } = req.body;

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { className, teacher, date, startTime, endTime },
      { new: true }
    ); // Update schedule in the database
    if (!updatedSchedule) {
      return res.status(404).send("Schedule not found");
    }
    res.redirect("/admin/schedules"); // Redirect to schedule list
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Delete Schedule
router.delete(
  "/admin/schedules/delete/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id); // Delete schedule by ID
      if (!deletedSchedule) {
        return res.status(404).send("Schedule not found");
      }
      res.status(200).json({ message: "Schedule deleted successfully" }); // Return success message
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// Export the router
module.exports = router;
