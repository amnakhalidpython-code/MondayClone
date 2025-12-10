import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import SignUpemailRoutes from './routes/SignUpemailRoutes.js';
import accountRoutes from "./routes/SignUpAccountRoutes.js";
import invitationRoutes from './routes/InvitationRoutes.js';
const boardRoutes = require('./routes/BoardRoute.js');


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/users',SignUpemailRoutes);
app.use("/api/account", accountRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/boards', boardRoutes);




// Test route
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
