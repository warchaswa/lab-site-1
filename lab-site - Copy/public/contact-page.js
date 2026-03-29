// public/contact-page.js
async function loadContact() {
  try {
    const res = await fetch("/api/public/professor");
    const prof = await res.json();
    const div = document.getElementById("contact-content");
    if (prof && prof.email) {
      div.innerHTML = `
        <p><strong>Lab Head:</strong> ${prof.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${prof.email}">${prof.email}</a></p>
        <p><strong>Lab:</strong> Advanced Materials Lab, University XYZ</p>
        <p><strong>Address:</strong> Department of Materials Science, University Campus, City, Country</p>
        ${prof.linkedin_url ? `<p><strong>LinkedIn:</strong> <a href="${prof.linkedin_url}" target="_blank">Profile</a></p>` : ""}
        ${prof.google_scholar_url ? `<p><strong>Google Scholar:</strong> <a href="${prof.google_scholar_url}" target="_blank">Publications</a></p>` : ""}
      `;
    } else {
      div.innerHTML = "<p>Contact information not available.</p>";
    }
  } catch (err) {
    console.error("Error loading contact:", err);
    div.innerHTML = "<p>Error loading data.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadContact);
