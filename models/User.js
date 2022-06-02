const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  fullname: { type: String, required: true },
  age: { type: Number, required: true, min: 10, max: 100 },
  gender: { type: String, enum: ["Male, Female"], required: true },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  account: { type: Schema.Types.ObjectId, ref: "Account", unique: true },
});

module.exports = mongoose.models.User || mongoose.model("User", User);
