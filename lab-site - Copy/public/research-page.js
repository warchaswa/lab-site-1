// public/research-page.js
async function loadResearch() {
  try {
    const res = await fetch("/api/public/professor");
    const prof = await res.json();
    const div = document.getElementById("research-content");
    if (prof && prof.research_areas) {
      const areas = prof.research_areas.split(",").map((a) => a.trim());
      div.innerHTML = `
        <p>${prof.bio || ""}</p>
        <h3 style="margin-top:1.5rem;">Focus Areas</h3>
        <ul style="margin-top:0.5rem;margin-left:1.5rem;">
          ${areas.map((a) => `<li>${a}</li>`).join("")}
        </ul>
      `;
    } else {
      div.innerHTML = "<p>Research information not available.</p>";
    }
  } catch (err) {
    console.error("Error loading research:", err);
    div.innerHTML = "<p>Error loading data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadResearch);
