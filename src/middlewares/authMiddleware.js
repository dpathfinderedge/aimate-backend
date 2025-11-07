import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token)
      return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user)
      return res.status(401).json({ message: "User not found" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
