// public/team-page.js
async function loadTeam() {
  try {
    const res = await fetch("/api/public/team");
    const team = await res.json();
    const grid = document.getElementById("team-grid");
    if (team.length > 0) {
      grid.innerHTML = team
        .map(
          (m) => `
        <div class="team-card">
          ${m.photo_url ? `<img src="${m.photo_url}" alt="${m.name}" class="team-photo"/>` : ""}
          <h3>${m.name}</h3>
          <p class="role">${m.role}</p>
          <p>${m.bio || ""}</p>
          <p>
            ${m.email ? `<a href="mailto:${m.email}">Email</a>` : ""}
            ${m.linkedin_url ? `| <a href="${m.linkedin_url}" target="_blank">LinkedIn</a>` : ""}
            ${m.researchgate_url ? `| <a href="${m.researchgate_url}" target="_blank">ResearchGate</a>` : ""}
          </p>
        </div>
      `,
        )
        .join("");
    } else {
      grid.innerHTML = "<p>No team members listed.</p>";
    }
  } catch (err) {
    console.error("Error loading team:", err);
    grid.innerHTML = "<p>Error loading data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadTeam);
