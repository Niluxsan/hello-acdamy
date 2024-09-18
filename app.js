const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const cors = require("cors");

const app = express();
connectDB();

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: "Niluxsan_1994_01_08",
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
  console.log(`Server running on port http://localhost:${PORT}`);
});
