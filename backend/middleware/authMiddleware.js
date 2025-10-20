import jwt from "jsonwebtoken";

// Middleware to protect routes by verifying JWT token
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from header
    const secret = process.env.JWT_SECRET;

    // Verify token and decode payload
    const decoded = jwt.verify(token, secret);

    // Attach decoded user info to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
