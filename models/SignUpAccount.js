import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  accountName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Account", accountSchema);
