const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required:true},
  role: { type: String, enum: ["Admin", "Explorer"], default: "Explorer" },
  location: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = { UserModel };
