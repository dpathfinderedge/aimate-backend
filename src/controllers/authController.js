import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "2h" });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, rememberMe } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = rememberMe ? generateRefreshToken(user._id) : null;

    res
      .status(201)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .cookie(
        "refreshToken",
        refreshToken || "",
        rememberMe
          ? {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, 
            }
          : { maxAge: 0 }
      )
      .json({
        message: "Registration successful",
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = rememberMe ? generateRefreshToken(user._id) : null;

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 2 * 60 * 60 * 1000, 
      })
      .cookie(
        "refreshToken",
        refreshToken || "",
        rememberMe
          ? {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "Lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, 
            }
          : { maxAge: 0 }
      )
      .json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .json({ message: "Access token refreshed" });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Logged out successfully" });
};

export const checkAuth = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.user });
};
