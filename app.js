require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const cors = require("cors");

const app = express();
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Change this to your frontend's URL if different
    credentials: true,
  })
);
app.use(express.json()); // Use built-in JSON middleware
app.use(express.static("public")); // Serve static files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
