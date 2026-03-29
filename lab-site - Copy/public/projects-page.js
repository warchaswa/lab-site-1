// public/projects-page.js
async function loadProjects() {
  try {
    const res = await fetch("/api/public/projects");
    const projects = await res.json();
    const div = document.getElementById("projects-list");
    if (projects.length > 0) {
      div.innerHTML = projects
        .map(
          (p) => `
        <div class="project-card">
          <h3>${p.title} <span class="status-badge">${p.status}</span></h3>
          <p>${p.description || ""}</p>
          <p><strong>Team:</strong> ${p.members || "N/A"}</p>
          <p><strong>Started:</strong> ${p.start_date || "N/A"}</p>
        </div>
      `,
        )
        .join("");
    } else {
      div.innerHTML = "<p>No projects listed.</p>";
    }
  } catch (err) {
    console.error("Error loading projects:", err);
    div.innerHTML = "<p>Error loading data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
