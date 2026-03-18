exports.saveDesign = (req, res) => {
  res.status(201).json({
    message: "Design saved successfully",
    designId: "design789",
    data: req.body,
  });
};

exports.getDesigns = (req, res) => {
  res.status(200).json([
    { id: "design1", room: "Living Room", items: 5 },
    { id: "design2", room: "Bedroom", items: 3 },
  ]);
};

exports.deleteDesign = (req, res) => {
  res.status(200).json({ message: "Design removed successfully" });
};
