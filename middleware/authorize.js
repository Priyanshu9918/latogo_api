// middleware/authorize.js
exports.authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.user_type)) {
      return res.status(403).json({ message: "Access denied for your role" });
    }
    next();
  };
};
