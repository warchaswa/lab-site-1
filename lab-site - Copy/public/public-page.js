// public/public-page.js
// Fetches and displays public data from the API.

async function loadPublicData() {
  // Load Professor
  try {
    const res = await fetch("/api/public/professor");
    const prof = await res.json();
    const profDiv = document.getElementById("professor-content");
    if (prof && prof.name) {
      profDiv.innerHTML = `
        <div class="profile-header">
          ${prof.photo_url ? `<img src="${prof.photo_url}" alt="${prof.name}" class="profile-photo"/>` : ""}
          <div>
            <h3>${prof.name}</h3>
            <p class="title">${prof.title}</p>
            <p>${prof.bio || ""}</p>
            <p><strong>Research Areas:</strong> ${prof.research_areas || "N/A"}</p>
            <p>
              ${prof.email ? `Email: <a href="mailto:${prof.email}">${prof.email}</a>` : ""}
              ${prof.linkedin_url ? `| <a href="${prof.linkedin_url}" target="_blank">LinkedIn</a>` : ""}
              ${prof.google_scholar_url ? `| <a href="${prof.google_scholar_url}" target="_blank">Google Scholar</a>` : ""}
            </p>
          </div>
        </div>
      `;
      // Update research section too
      const researchDiv = document.getElementById("research-content");
      if (researchDiv) {
        researchDiv.innerHTML = `<p>${prof.research_areas || "Research areas not specified."}</p>`;
      }
      // Update contact
      const contactDiv = document.getElementById("contact-content");
      if (contactDiv && prof.email) {
        contactDiv.innerHTML = `
          <p><strong>Email:</strong> <a href="mailto:${prof.email}">${prof.email}</a></p>
          <p><strong>Lab:</strong> Advanced Materials Lab, University XYZ</p>
        `;
      }
    } else {
      profDiv.innerHTML = "<p>Professor information not available.</p>";
    }
  } catch (err) {
    console.error("Error loading professor:", err);
  }

  // Load Team
  try {
    const res = await fetch("/api/public/team");
    const team = await res.json();
    const teamGrid = document.getElementById("team-grid");
    if (team.length > 0) {
      teamGrid.innerHTML = team
        .map(
          (m) => `
        <div class="team-card">
          ${m.photo_url ? `<img src="${m.photo_url}" alt="${m.name}" class="team-photo"/>` : ""}
          <h4>${m.name}</h4>
          <p class="role">${m.role}</p>
          <p>${m.bio || ""}</p>
          <p>
            ${m.email ? `<a href="mailto:${m.email}">Email</a>` : ""}
            ${m.linkedin_url ? ` | <a href="${m.linkedin_url}" target="_blank">LinkedIn</a>` : ""}
            ${m.researchgate_url ? ` | <a href="${m.researchgate_url}" target="_blank">ResearchGate</a>` : ""}
          </p>
        </div>
      `,
        )
        .join("");
    } else {
      teamGrid.innerHTML = "<p>No team members listed.</p>";
    }
  } catch (err) {
    console.error("Error loading team:", err);
  }

  // Load Publications
  try {
    const res = await fetch("/api/public/publications");
    const pubs = await res.json();
    const pubsList = document.getElementById("publications-list");
    if (pubs.length > 0) {
      pubsList.innerHTML = pubs
        .map(
          (p) => `
        <li>
          <strong>${p.title}</strong><br/>
          <em>${p.authors || ""}</em><br/>
          ${p.journal ? `${p.journal}, ${p.year}` : p.year}<br/>
          ${p.doi_url ? `<a href="${p.doi_url}" target="_blank">DOI</a>` : ""}
          ${p.pdf_url ? ` | <a href="${p.pdf_url}" target="_blank">PDF</a>` : ""}
        </li>
      `,
        )
        .join("");
    } else {
      pubsList.innerHTML = "<li>No publications listed.</li>";
    }
  } catch (err) {
    console.error("Error loading publications:", err);
  }

  // Load Projects
  try {
    const res = await fetch("/api/public/projects");
    const projects = await res.json();
    const projectsDiv = document.getElementById("projects-list");
    if (projects.length > 0) {
      projectsDiv.innerHTML = projects
        .map(
          (p) => `
        <div class="project-card">
          <h4>${p.title} <span class="status-badge">${p.status}</span></h4>
          <p>${p.description || ""}</p>
          <p><strong>Team:</strong> ${p.members || "N/A"}</p>
          <p><strong>Started:</strong> ${p.start_date || "N/A"}</p>
        </div>
      `,
        )
        .join("");
    } else {
      projectsDiv.innerHTML = "<p>No projects listed.</p>";
    }
  } catch (err) {
    console.error("Error loading projects:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPublicData);
