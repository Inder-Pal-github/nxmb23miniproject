const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { userlogger } = require("../middlewares/userLogger");
const { authenticator } = require("../middlewares/authenticator");
const { validator } = require("../middlewares/validator");
const { UserModel } = require("../models/user.model");

const userRouter = Router();

// ------ Get all users ----------
userRouter.get("/all", async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ------- Create New User ----------
userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(403).json({
        message: "Email already taken, please user another one or login.",
      });
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = await new UserModel({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User successfully created.", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------- Login user --------------
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUserPresent = await UserModel.findOne({ email });
    if (!isUserPresent) {
      res.status(403).json({ message: "User doesn't exist, please signup." });
    }
    const checkPassword = await bcrypt.compareSync(
      password,
      isUserPresent.password
    );
    if (checkPassword) {
      // create jwt token
      const token = await jwt.sign(
        { email, userId: isUserPresent._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.TOKEN_LIFE }
      );
      const refreshToken = await jwt.sign(
        { email, userId: isUserPresent._id },
        process.env.JWT_SECRET_REFRESH,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
      );
      return res.status(200).json({
        message: "Login successful",
        token,
        refreshToken,
        user: isUserPresent,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------- Get a particular user ---------
userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    res.send({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------ Update user details -----------

userRouter.patch("/:id", authenticator, validator, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updated = await UserModel.findByIdAndUpdate(id, update);
    res.send("Updated");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------- Delete particular user ----------
userRouter.delete("/:id", authenticator, validator, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserModel.findByIdAndDelete(id);
    return res.send({ msg: "User deleted", user: deleted });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { userRouter };
