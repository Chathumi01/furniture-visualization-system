exports.registerUser = (req, res) => {
  res.status(201).json({
    _id: "mockId123",
    name: req.body.name || "Test User",
    email: req.body.email || "test@test.com",
    token: "mockJwtTokenXYZ",
  });
};

exports.loginUser = (req, res) => {
  res.status(200).json({
    _id: "mockId123",
    name: "Admin User",
    email: req.body.email,
    role: "admin",
    token: "mockJwtTokenXYZ",
  });
};
