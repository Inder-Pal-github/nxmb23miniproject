const { UserModel } = require("../models/user.model");

exports.validator = async (req, res, next) => {
  // check user role
  try {
    // find the user and check role
    const user = await UserModel.findById(req.userId);
    if (user.role === "Admin") {
      next();
    } else {
      res.status(500).json({ message: "Not authorized!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Not authorized!" });
  }
  next();
};
