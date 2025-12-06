import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // ADD THIS LINE
  fullName: { type: String, required: true },
  accountName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Account", accountSchema);