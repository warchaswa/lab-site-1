// db/seed.js
// Seeds initial data for professor, team, projects, and publications.

const db = require("./database");

function seed() {
  // Insert professor (lab head)
  db.run(
    `INSERT OR IGNORE INTO professor (id, name, title, bio, email, photo_url, research_areas, google_scholar)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1,
      "Dr. Dheeraj Kumar",
      "Assistant Professor at International Institute for Aerospace Engineering and Management, Bengaluru, India",
      "Dr. Dheeraj Kumar has 12 years of experience in industry, academia, and research. His research focuses on nanomaterials for biological applications, energy and hydrogen storage, medium entropy alloys, multicomponent functionally graded materials, 3D/4D printing, shape memory alloys, and molecular dynamics simulations.",
      "garadheeraj.kumar@jainuniversity.ac.in",
      "/images/professor.jpg",
      "Nanomaterials, Energy Storage, Hydrogen Storage, Medium Entropy Alloys, Functionally Graded Materials, 3D/4D Printing, Shape Memory Alloys, Molecular Dynamics",
      "https://scholar.google.com/citations?user=-AR405cAAAAJ&hl=en",
    ],
    function (err) {
      if (err) console.error("❌ Error inserting professor:", err);
      else console.log("✅ Professor data seeded");
    },
  );
  // Insert sample team members
  const members = [
    [
      "Alice Johnson",
      "PhD Student",
      "Working on nano-coatings.",
      "https://via.placeholder.com/150",
      "https://linkedin.com",
      "https://researchgate.net",
      "alice@uni.edu",
    ],
    [
      "Bob Lee",
      "Master's Student",
      "Focus on battery materials.",
      "https://via.placeholder.com/150",
      "https://linkedin.com",
      "https://researchgate.net",
      "bob@uni.edu",
    ],
    [
      "Dr. Carol White",
      "Postdoc",
      "Expert in spectroscopy.",
      "https://via.placeholder.com/150",
      "https://linkedin.com",
      "https://researchgate.net",
      "carol@uni.edu",
    ],
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO team_members (name, role, bio, photo_url, linkedin_url, researchgate_url, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  members.forEach((m) => stmt.run(m));
  stmt.finalize();

  // Insert sample projects
  db.run(`
    INSERT OR IGNORE INTO projects (title, description, start_date, status, members)
    VALUES 
      ('Nano-Coatings for Solar Panels', 'Developing durable anti-reflective coatings.', '2024-01', 'ongoing', 'Alice, Bob'),
      ('Next-Gen Battery Materials', 'High-capacity anode materials for Li-ion batteries.', '2023-06', 'ongoing', 'Bob, Carol')
  `);

  // Insert sample publications
  db.run(`
    INSERT OR IGNORE INTO publications (title, authors, journal, year, doi_url)
    VALUES 
      ('Advanced Nanomaterials for Energy Storage', 'J. Smith, A. Johnson', 'Nature Materials', 2024, 'https://doi.org/10.1000/example1'),
      ('Spectroscopic Analysis of Battery Degradation', 'C. White, J. Smith', 'Journal of Power Sources', 2023, 'https://doi.org/10.1000/example2')
  `);

  console.log("✅ Database seeded with sample data");
  db.close();
}

seed();
