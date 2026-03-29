// public/publications-page.js
async function loadPublications() {
  try {
    const res = await fetch("/api/public/publications");
    const pubs = await res.json();
    const list = document.getElementById("publications-list");
    if (pubs.length > 0) {
      list.innerHTML = pubs
        .map(
          (p) => `
        <li>
          <strong>${p.title}</strong><br/>
          <em>${p.authors || ""}</em><br/>
          ${p.journal ? `${p.journal}, ${p.year}` : p.year}<br/>
          ${p.doi_url ? `<a href="${p.doi_url}" target="_blank">DOI</a>` : ""}
          ${p.pdf_url ? `| <a href="${p.pdf_url}" target="_blank">PDF</a>` : ""}
        </li>
      `,
        )
        .join("");
    } else {
      list.innerHTML = "<li>No publications listed.</li>";
    }
  } catch (err) {
    console.error("Error loading publications:", err);
    list.innerHTML = "<li>Error loading data.</li>";
  }
}

document.addEventListener("DOMContentLoaded", loadPublications);
