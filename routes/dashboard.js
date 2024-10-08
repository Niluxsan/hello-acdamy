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
router.get("/admin/users", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
  const page = parseInt(req.query.page) || 1; // Default page to 1 if not provided

  try {
    const users = await User.find({}, "username email role")
      .limit(limit) // Limit the number of users returned
      .skip((page - 1) * limit); // Skip users based on the page number

    const totalUsers = await User.countDocuments(); // Get total count of users

    res.json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    });
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
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Edit User Details (POST)
router.post("/admin/users/edit/:id", authMiddleware, async (req, res) => {
  try {
    // Find user by ID and update with the request body data
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated user
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return a success message and the updated user data
    res.json({
      message: "User updated successfully 🎉",
      user: updatedUser,
    });
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
    const limit = parseInt(req.query.limit) || 10; // Limit of items per page, default 10
    const page = parseInt(req.query.page) || 1; // Current page, default 1
    const skip = (page - 1) * limit; // Calculate how many records to skip

    // Fetch the total number of schedules
    const totalSchedules = await Schedule.countDocuments();

    // Fetch schedules with pagination and populate teacher's name
    const schedules = await Schedule.find()
      .populate("teacher", "name")
      .limit(limit)
      .skip(skip);

    res.json({
      totalDetails: totalSchedules, // Total number of schedules
      currentPage: page, // Current page
      totalPages: Math.ceil(totalSchedules / limit), // Total pages
      schedules, // The schedule data
    });
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
    res.json(schedule); // Render edit schedule form
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
    res.json(updatedSchedule);
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
