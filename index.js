import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import SignUpemailRoutes from './routes/SignUpemailRoutes.js';
import accountRoutes from "./routes/SignUpAccountRoutes.js";
import invitationRoutes from './routes/InvitationRoutes.js';
import  boardRoutes from './routes/BoardRoute.js';
import InvitationRoutes from './routes/InvitationRoutes.js';
import NotificationRoutes from './routes/notificationRoutes.js';
import templateRoutes from './routes/TemplateRoutes.js';


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
app.use('/api/invitations', InvitationRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api', templateRoutes);





app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
