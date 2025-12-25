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
import donorRoutes from './routes/DonorRoutes.js';
import columnRoutes from './routes/ColumnRoutes.js';


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",  
      "https://monday-clone-frontend.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());



// Routes
app.use('/api/users',SignUpemailRoutes);
app.use("/api/account", accountRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/invitations', InvitationRoutes);
app.use('/api/notifications', NotificationRoutes);
app.use('/api', templateRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/columns', columnRoutes);





app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.stack);
  console.error('Error details:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
