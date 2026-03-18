exports.protect = (req, res, next) => {
  req.user = { id: "mockId123", role: "user" };
  next();
};
