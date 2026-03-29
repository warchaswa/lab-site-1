const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "lab.db");
const db = new Database(dbPath);

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'professor', 'lab_incharge', 'admin')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS professor (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT,
      bio TEXT,
      email TEXT,
      photo_url TEXT,
      research_areas TEXT,
      google_scholar TEXT
    );
    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT,
      bio TEXT,
      photo_url TEXT
    );
    CREATE TABLE IF NOT EXISTS publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authors TEXT,
      journal TEXT,
      year INTEGER,
      doi TEXT,
      link TEXT
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('ongoing', 'completed')) DEFAULT 'ongoing',
      start_date TEXT,
      end_date TEXT
    );
    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY,
      lab_name TEXT,
      address TEXT,
      email TEXT,
      phone TEXT,
      google_form_link TEXT
    );
  `);

  const row = db.prepare("SELECT COUNT(*) as count FROM professor").get();
  if (row.count === 0) seedData();
}

function seedData() {
  db.prepare(
    `INSERT OR IGNORE INTO professor (id, name, title, bio, email, photo_url, research_areas, google_scholar)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    1,
    "Dr. Dheeraj Kumar",
    "Assistant Professor & Lab Head",
    "Dr. Dheeraj Kumar has 12 years of experience in industry, academia, and research. His research focuses on nanomaterials for biological applications, energy and hydrogen storage, medium entropy alloys, multicomponent functionally graded materials, 3D/4D printing, shape memory alloys, and molecular dynamics simulations.",
    "garadheeraj.kumar@jainuniversity.ac.in",
    "/images/professor.jpg",
    "Nanomaterials, Energy Storage, Hydrogen Storage, Medium Entropy Alloys, Functionally Graded Materials, 3D/4D Printing, Shape Memory Alloys, Molecular Dynamics",
    "https://scholar.google.com/citations?user=-AR405cAAAAJ&hl=en",
  );

  const adminPassword = bcrypt.hashSync("admin123", 10);
  db.prepare(
    `INSERT OR IGNORE INTO users (id, name, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(999, "Site Admin", "admin@lab.com", adminPassword, "admin");

  db.prepare(
    `INSERT OR IGNORE INTO contact_info (id, lab_name, address, email, phone, google_form_link)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    1,
    "Advanced Materials Lab",
    "Bengaluru, Karnataka, India",
    "garadheeraj.kumar@jainuniversity.ac.in",
    "",
    "",
  );

  console.log("✅ Default data seeded");
}

module.exports = { db, initDatabase };
