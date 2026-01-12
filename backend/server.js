require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Habit = require("./models/Habit");
const User = require("./models/User");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

/* =====================
   MIDDLEWARE
===================== */
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

/* =====================
   MONGODB CONNECTION
===================== */
mongoose
  .connect(process.env.MONGO_URI)
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
   HEALTH / WAKE ROUTE
===================== */
app.get("/", (req, res) => {
  res.status(200).send("Habit Tracker Backend is running 🚀");
});

/* =====================
   AUTH ROUTES
===================== */
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.json({ message: "User created successfully" });
  } catch {
    res.status(500).json({ error: "Signup failed" });
  }
});

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
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

/* =====================
   HABIT ROUTES
===================== */
app.get("/habits", authMiddleware, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.username });
  res.json(habits);
});

app.post("/habits", authMiddleware, async (req, res) => {
  const habit = new Habit({
    userId: req.user.username,
    name: req.body.name,
    done: false,
    streak: 0,
    lastChecked: null
  });

  await habit.save();
  res.json(habit);
});

app.put("/habits/:id", authMiddleware, async (req, res) => {
  const updatedHabit = await Habit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedHabit);
});

app.delete("/habits/:id", authMiddleware, async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
