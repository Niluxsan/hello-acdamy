const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from headers

  if (!token) {
    return res.status(401).json({ msg: "No token provided" }); // No token found
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user info to request
    next(); // Proceed to next middleware or route
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" }); // Invalid token
  }
};

module.exports = authMiddleware; // Export the middleware
