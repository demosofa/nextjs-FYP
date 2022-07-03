const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  fullname: { type: String, required: true },
  dateOfBirth: { type: Date, required: true, min: "1987-09-28" },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  phoneNumber: { type: Number, required: true },
});

module.exports = mongoose.models.User || mongoose.model("User", User);
