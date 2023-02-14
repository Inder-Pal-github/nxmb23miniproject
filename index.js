const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("B23-mini project");
});

// user-router

app.use("/users", userRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Listening on http://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
});
