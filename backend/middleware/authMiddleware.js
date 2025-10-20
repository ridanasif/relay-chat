import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Get token after "Bearer"
    const secret = process.env.JWT_SECRET;

    // Verify token
    const decoded = jwt.verify(token, secret);

    // Attach decoded user data to request
    req.user = decoded;

    // Continue to next middleware or route
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
