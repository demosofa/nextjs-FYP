import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema(
  {
    fullname: { type: String, required: true },
    dateOfBirth: { type: Date, required: true, min: "1987-09-28" },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", User);
