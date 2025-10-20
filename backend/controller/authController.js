import bcrypt from "bcrypt";
import User from "../model/User.js";
import { sendResponse } from "../utils/sendResponse.js";
import jwt from "jsonwebtoken";

const createJWTToken = ({ id, username }) => {
  return jwt.sign(
    { id, username },
    process.env.JWT_SECRET || "AVeryLongRandomSecret",
    { expiresIn: "30d" }
  );
};

export const register = async (req, res) => {
  const { fullname, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const u = await User.findOne({ username });

  if (u) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      data: null,
      message: "User already exists",
    });
  }

  const newUser = new User({ fullname, username, password: hashedPassword });
  await newUser.save();

  const token = createJWTToken({ id: newUser.id, username: newUser.username });
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    data: { username, token },
    message: "",
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      data: null,
      message: "User does not exists.",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    const token = createJWTToken({ id: user.id, username: user.username });
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      data: { username, token },
      message: "",
    });
  } else {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      data: null,
      message: "Invalid credentials",
    });
  }
};
