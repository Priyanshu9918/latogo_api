const jwt = require("jsonwebtoken");

// Authenticate Student
exports.authenticateStudent = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id, role }  (login me set kiya tha)
    req.student = decoded; // ✅ yaha "decoded.student" hi aayega
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Authorize Student Role
exports.authorizeStudent = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.student.role)) {
      return res.status(403).json({ message: "Access denied for your role" });
    }
    next();
  };
};
