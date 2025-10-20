import bcrypt from "bcrypt";
import User from "../model/User.js";
import { sendResponse } from "../utils/sendResponse.js";
import jwt from "jsonwebtoken";

// Helper function to create JWT token for a user
const createJWTToken = ({ id, username }) => {
  return jwt.sign(
    { id, username },
    process.env.JWT_SECRET || "AVeryLongRandomSecret", // fallback secret
    { expiresIn: "30d" } // token valid for 30 days
  );
};

// Controller to handle user registration
export const register = async (req, res) => {
  const { fullname, username, password } = req.body;
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const u = await User.findOne({ username });

  if (u) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      data: null,
      message: "User already exists",
    });
  }

  // Create and save new user
  const newUser = new User({ fullname, username, password: hashedPassword });
  await newUser.save();

  // Generate JWT token for the new user
  const token = createJWTToken({ id: newUser.id, username: newUser.username });
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    data: { username, token },
    message: "",
  });
};

// Controller to handle user login
export const login = async (req, res) => {
  const { username, password } = req.body;
  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      data: null,
      message: "User does not exists.",
    });
  }
  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // If match, generate JWT token
    const token = createJWTToken({ id: user.id, username: user.username });
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      data: { username, token },
      message: "",
    });
  } else {
    // Password mismatch
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      data: null,
      message: "Invalid credentials",
    });
  }
};
