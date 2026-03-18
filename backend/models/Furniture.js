const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    dimensions: { type: String },
    isMovable: { type: Boolean, default: true },
    isRotatable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Furniture", furnitureSchema);
