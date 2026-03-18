const express = require("express");
const {
  saveDesign,
  getDesigns,
  deleteDesign,
} = require("../controllers/designController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, saveDesign).get(protect, getDesigns);
router.route("/:id").delete(protect, deleteDesign);

module.exports = router;
