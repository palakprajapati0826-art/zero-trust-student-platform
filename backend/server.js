const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const documentRoutes = require("./routes/documentRoutes");

dotenv.config();

const app = express();

/* ================================
   SECURITY
================================ */

app.use(helmet());

/* ================================
   GENERAL MIDDLEWARE
================================ */

app.use(cors());
app.use(express.json());

/* ================================
   DATABASE CONNECTION
================================ */

connectDB();

/* ================================
   ROOT TEST ROUTE
================================ */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zero Trust Student Platform Backend Running",
  });
});

/* ================================
   AUTHENTICATION ROUTES
================================ */

app.use("/api/auth", authRoutes);

/* ================================
   STUDENT ROUTES
================================ */

app.use("/api/student", studentRoutes);

/* ================================
   DOCUMENT ROUTES
================================ */

app.use("/api/student/documents", documentRoutes);

/* ================================
   404 HANDLER
================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ================================
   ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});