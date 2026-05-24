
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

// ✅ CONNECT DB WITH ERROR HANDLING
connectDB();

const app = express();

// ✅ CORS CONFIG (important for frontend)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ BODY PARSER
app.use(express.json());

// ✅ TEST ROUTE (check server working)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ❌ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

// ✅ PORT SAFE
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);