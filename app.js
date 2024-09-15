const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
