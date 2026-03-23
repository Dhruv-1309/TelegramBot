const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    difficulty: { type: String, default: "easy" },
    hint: { type: String, default: "" },
    solutionUrl: { type: String, default: "" },
  },
  { _id: false },
);

const dailyAssignmentSchema = new mongoose.Schema(
  {
    chatId: { type: Number, required: true, index: true },
    dateKey: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, default: "easy" },
    questions: {
      leetcode: { type: questionSchema, required: true },
      gfg: { type: questionSchema, required: true },
      codechef: { type: questionSchema, required: true },
    },
    questionsSentAt: Date,
    hintsSentAt: Date,
    solutionsSentAt: Date,
  },
  { timestamps: true },
);

dailyAssignmentSchema.index({ chatId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("DailyAssignment", dailyAssignmentSchema);
