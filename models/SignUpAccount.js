// models/SignUpAccount.js
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  accountName: { type: String },
  category: { type: String, default: 'work' }, // 🆕 NEW FIELD - ye store karega ki user ne kya select kiya
  role: { type: String }, // 🆕 Role bhi save kar sakte ho (optional)
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Account", accountSchema);