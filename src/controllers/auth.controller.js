import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Register
export const register = asyncHandler(async (req, res) => {
  const {
    userType, // "individual" or "company"
    username,
    fullName,
    email,
    phone,
    password,
    avatarUrl,
    location,
    address,

    // company details
    officialName,
    contactPerson,
    website,
  } = req.body;

  // Validate userType
  if (!["individual", "company"].includes(userType)) {
    return res.status(400).json({ message: "Invalid user type" });
  }

  // Check for unique constraints
  const emailExists = await User.findOne({ email });
  if (emailExists)
    return res.status(409).json({ message: "Email already registered" });

  if (username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.status(409).json({ message: "Username already taken" });
  }

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists)
      return res
        .status(409)
        .json({ message: "Phone number already registered" });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Build user object
  const userData = {
    userType,
    email,
    phone,
    passwordHash,
    avatarUrl,
    location,
    address,
  };

  if (userType === "individual") {
    userData.username = username;
    userData.individual = { fullName };
  } else if (userType === "company") {
    userData.company = { officialName, contactPerson, website };
  }

  // Create user
  const user = await User.create(userData);

  // JWT
  const token = sign(user);

  res.json({
    token,
    user,
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = sign(user);

  res.json({
    token,
    user,
  });
});

// Get current user
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json({ user });
});
