const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    usabilityScore: { type: Number, required: true },
    comments: { type: String, required: true },
    testedUI: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
