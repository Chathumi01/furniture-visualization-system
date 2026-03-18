const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomLayout: { type: Object, required: true },
    furnitureItems: { type: Array, required: true },
    wallColor: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Design", designSchema);
