// routes/public.js
// Public API routes for professor, team, projects, publications.

const express = require("express");
const db = require("../db/database");

const router = express.Router();

// GET /api/public/professor
router.get("/professor", (req, res) => {
  db.get("SELECT * FROM professor LIMIT 1", [], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(row || {});
  });
});

// GET /api/public/team
router.get("/team", (req, res) => {
  db.all("SELECT * FROM team_members", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows || []);
  });
});

// GET /api/public/projects
router.get("/projects", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows || []);
  });
});

// GET /api/public/publications
router.get("/publications", (req, res) => {
  db.all("SELECT * FROM publications ORDER BY year DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows || []);
  });
});

module.exports = router;
