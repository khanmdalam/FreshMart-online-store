const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PINCODE_REGEX = /^\d+$/;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => (
  email.length <= 254 && EMAIL_REGEX.test(email)
);

const normalizePincode = (pincode) => String(pincode || "").trim();

const toUserResponse = (user, token = null) => {
  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    avatar: user.avatar || "",
    address: user.address || {},
  };

  if (token) {
    response.token = token;
  }

  return response;
};

//REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = normalizeEmail(email);
    const normalizedGender = String(gender || "").trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !normalizedGender) {
      return res.status(400).json({
        message: "name, email, password and gender are required",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (!["male", "female"].includes(normalizedGender)) {
      return res.status(400).json({ message: "Gender must be male or female" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      gender: normalizedGender,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json(toUserResponse(newUser, token));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const foundUser = await User.findOne({ email: normalizedEmail });
    if (!foundUser) {
      return res.status(401).json({ message: "Email is not registered" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: foundUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json(toUserResponse(foundUser, token));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(toUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, address, gender, avatar } = req.body;
    const normalizedGender = String(gender || "").trim().toLowerCase();

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!normalizedGender || !["male", "female"].includes(normalizedGender)) {
      return res.status(400).json({ message: "Gender must be male or female" });
    }

    const normalizedPincode = normalizePincode(address?.pincode);
    if (normalizedPincode && !PINCODE_REGEX.test(normalizedPincode)) {
      return res.status(400).json({ message: "Pincode should contain numbers only" });
    }

    user.name = name.trim();
    user.gender = normalizedGender;
    user.address = {
      street: address?.street?.trim() || "",
      city: address?.city?.trim() || "",
      state: address?.state?.trim() || "",
      pincode: normalizedPincode,
    };
    user.avatar = typeof avatar === "string" ? avatar : user.avatar || "";

    const updatedUser = await user.save();
    res.status(200).json(toUserResponse(updatedUser));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, getAllUsers };
