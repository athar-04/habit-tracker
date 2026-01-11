const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Habit = require("./models/Habit");
const User = require("./models/User");

const app = express();
const JWT_SECRET = "supersecretkey"; // later move to .env

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   MONGODB CONNECTION
===================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/habitTracker")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* =====================
   AUTH MIDDLEWARE
===================== */
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

/* =====================
   TEST ROUTE
===================== */
app.get("/", (req, res) => {
  res.send("Habit Tracker Backend is running");
});

/* =====================
   AUTH ROUTES
===================== */

/**
 * Signup
 */
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "User created successfully" });

  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

/**
 * Login
 */
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

/* =====================
   HABIT APIs (PROTECTED)
===================== */

/**
 * Get habits for logged-in user
 */
app.get("/habits", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.username });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

/**
 * Add new habit
 */
app.post("/habits", authMiddleware, async (req, res) => {
  try {
    const habit = new Habit({
      userId: req.user.username,
      name: req.body.name,
      done: false,
      streak: 0,
      lastChecked: null
    });

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(400).json({ error: "Failed to add habit" });
  }
});

/**
 * Update habit
 */
app.put("/habits/:id", authMiddleware, async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHabit);
  } catch (err) {
    res.status(400).json({ error: "Failed to update habit" });
  }
});

/**
 * Delete habit
 */
app.delete("/habits/:id", authMiddleware, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete habit" });
  }
});

/* =====================
   START SERVER
===================== */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
