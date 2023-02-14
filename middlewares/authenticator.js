const jwt = require("jsonwebtoken");

exports.authenticator = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      res.status(403).json({ message: "Not authorized!" });
    }
    const isValid = await jwt.verify(token, process.env.JWT_SECRET);
    if (!isValid) res.status(403).json({ messagge: "Not authorized!" });

    req.userId = isValid.userId;
    req.token = token;
    req.email = isValid.email;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
