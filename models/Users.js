const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
    unique: true,
  },
  topics: [String],
  difficulty: {
    type: String,
    default: "auto",
  },
  morningTime: String,
  eveningTime: String,
  timezone: {
    type: String,
    default: "UTC",
  },
  streak: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
