const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../db/database");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" },
  );
  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.get("/professor", (req, res) => {
  const row = db.prepare("SELECT * FROM professor WHERE id = 1").get();
  if (!row) return res.status(404).json({ error: "Professor not found" });
  res.json(row);
});

router.put("/professor", verifyAdmin, (req, res) => {
  const { name, title, bio, email, research_areas, google_scholar } = req.body;
  db.prepare(
    `UPDATE professor SET name=?, title=?, bio=?, email=?, research_areas=?, google_scholar=? WHERE id=1`,
  ).run(name, title, bio, email, research_areas, google_scholar);
  res.json({ message: "Professor updated" });
});

router.get("/team", (req, res) => {
  const rows = db.prepare("SELECT * FROM team_members").all();
  res.json(rows || []);
});

router.post("/team", verifyAdmin, (req, res) => {
  const { name, role, bio, photo_url } = req.body;
  const result = db
    .prepare(
      `INSERT INTO team_members (name, role, bio, photo_url) VALUES (?, ?, ?, ?)`,
    )
    .run(name, role, bio, photo_url || "/images/default-avatar.png");
  res.json({ message: "Team member added", id: result.lastInsertRowid });
});

router.delete("/team/:id", verifyAdmin, (req, res) => {
  const result = db
    .prepare("DELETE FROM team_members WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Team member deleted" });
});

router.get("/publications", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM publications ORDER BY year DESC")
    .all();
  res.json(rows || []);
});

router.post("/publications", verifyAdmin, (req, res) => {
  const { title, authors, journal, year, doi, link } = req.body;
  const result = db
    .prepare(
      `INSERT INTO publications (title, authors, journal, year, doi, link) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(title, authors, journal, year, doi, link);
  res.json({ message: "Publication added", id: result.lastInsertRowid });
});

router.delete("/publications/:id", verifyAdmin, (req, res) => {
  const result = db
    .prepare("DELETE FROM publications WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Publication deleted" });
});

router.get("/projects", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM projects ORDER BY start_date DESC")
    .all();
  res.json(rows || []);
});

router.post("/projects", verifyAdmin, (req, res) => {
  const { title, description, status, start_date, end_date } = req.body;
  const result = db
    .prepare(
      `INSERT INTO projects (title, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)`,
    )
    .run(title, description, status, start_date, end_date);
  res.json({ message: "Project added", id: result.lastInsertRowid });
});

router.delete("/projects/:id", verifyAdmin, (req, res) => {
  const result = db
    .prepare("DELETE FROM projects WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Project deleted" });
});

router.get("/contact", (req, res) => {
  const row = db.prepare("SELECT * FROM contact_info WHERE id = 1").get();
  if (!row) return res.status(404).json({ error: "Contact info not found" });
  res.json(row);
});

router.put("/contact", verifyAdmin, (req, res) => {
  const { lab_name, address, email, phone, google_form_link } = req.body;
  db.prepare(
    `UPDATE contact_info SET lab_name=?, address=?, email=?, phone=?, google_form_link=? WHERE id=1`,
  ).run(lab_name, address, email, phone, google_form_link);
  res.json({ message: "Contact info updated" });
});

router.get("/users", verifyAdmin, (req, res) => {
  const rows = db
    .prepare("SELECT id, name, email, role, created_at FROM users")
    .all();
  res.json(rows || []);
});

router.post("/users", verifyAdmin, (req, res) => {
  const { name, email, password, role } = req.body;
  if (!["student", "professor", "lab_incharge", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const hashed = bcrypt.hashSync(password, 10);
  try {
    const result = db
      .prepare(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      )
      .run(name, email, hashed, role);
    res.json({ message: "User created", userId: result.lastInsertRowid });
  } catch (err) {
    if (err.message.includes("UNIQUE"))
      return res.status(400).json({ error: "Email already exists" });
    return res.status(500).json({ error: "Database error" });
  }
});

router.delete("/users/:id", verifyAdmin, (req, res) => {
  const result = db
    .prepare("DELETE FROM users WHERE id = ?")
    .run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ message: "User deleted" });
});

module.exports = router;
