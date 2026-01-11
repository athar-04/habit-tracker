const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0
  },
  lastChecked: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Habit", HabitSchema);
