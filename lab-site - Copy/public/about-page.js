// public/about-page.js
async function loadProfessor() {
  try {
    const res = await fetch("/api/public/professor");
    const prof = await res.json();
    const div = document.getElementById("professor-content");
    if (prof && prof.name) {
      div.innerHTML = `
        <div class="profile-header">
          ${prof.photo_url ? `<img src="${prof.photo_url}" alt="${prof.name}" class="profile-photo"/>` : ""}
          <div>
            <h2>${prof.name}</h2>
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
    } else {
      div.innerHTML = "<p>Professor information not available.</p>";
    }
  } catch (err) {
    console.error("Error loading professor:", err);
    div.innerHTML = "<p>Error loading data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProfessor);
