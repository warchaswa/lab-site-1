require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const { initDatabase } = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize database
initDatabase();

// Routes
app.use("/api", authRoutes);

// Admin dashboard route (protected)
app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "dashboard.html"));
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Lab website backend is running!" });
});

// Catch-all for SPA-like behavior
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📁 Public folder: ${path.join(__dirname, "public")}`);
});
