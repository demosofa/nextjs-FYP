const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const File = new Schema(
  {
    name: { type: String, required: true },
    public_id: { type: String, required: true, unique: true },
    format: { type: String },
    type: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.models.File || mongoose.model("File", File);
