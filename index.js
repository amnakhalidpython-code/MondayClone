import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import SignUpemailRoutes from "./routes/SignUpemailRoutes.js";
import accountRoutes from "./routes/SignUpAccountRoutes.js";
import invitationRoutes from "./routes/InvitationRoutes.js";
import boardRoutes from "./routes/BoardRoute.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import templateRoutes from "./routes/TemplateRoutes.js";
import donorRoutes from "./routes/DonorRoutes.js";
import columnRoutes from "./routes/ColumnRoutes.js";
import GrantRoutes from "./routes/GrantRoutes.js";
dotenv.config();
connectDB();

const app = express();

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://monday-clone-frontend.vercel.app",
  "https://monday-frontend-one.vercel.app",
  "https://monday-clone-nextjs-nu.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// ✅ Apply CORS - this handles preflight OPTIONS requests automatically
app.use(cors(corsOptions));

app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/users", SignUpemailRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", templateRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/grants", GrantRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

/* -------------------- ROOT -------------------- */
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

// Only listen if the file is run directly (not imported by Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

/* -------------------- EXPORT FOR VERCEL -------------------- */
export default app;