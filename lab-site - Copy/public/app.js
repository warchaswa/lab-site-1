const page = window.location.pathname.split('/').pop() || 'index.html';

// ── ABOUT PAGE ──
if (page === 'about.html') {
  fetch('/api/professor')
    .then(r => r.json())
    .then(d => {
      document.getElementById('professor-info').innerHTML = `
        <div class="professor-profile">
          <div class="professor-photo-placeholder">
            ${(d.name || 'P').charAt(d.name.indexOf(' ') + 1) || d.name.charAt(0)}
          </div>
          <div>
            <div class="professor-name">${d.name || ''}</div>
            <div class="professor-title">${d.title || ''}</div>
            <p class="professor-bio">${d.bio || ''}</p>
            <div class="professor-links">
              ${d.email ? `<a href="mailto:${d.email}" class="prof-link">✉ Email</a>` : ''}
              ${d.google_scholar ? `<a href="${d.google_scholar}" target="_blank" class="prof-link">◆ Google Scholar</a>` : ''}
            </div>
          </div>
        </div>
        ${d.research_areas ? `
          <div class="section-label" style="margin-top: 40px;">Research Interests</div>
          <div class="research-grid">
            ${d.research_areas.split(',').map(r => `<div class="research-item">${r.trim()}</div>`).join('')}
          </div>
        ` : ''}
      `;
    })
    .catch(() => {
      document.getElementById('professor-info').innerHTML = '<p style="color:var(--text-muted)">Unable to load profile.</p>';
    });
}

// ── RESEARCH PAGE ──
if (page === 'research.html') {
  fetch('/api/professor')
    .then(r => r.json())
    .then(d => {
      const areas = (d.research_areas || '').split(',').filter(Boolean);
      if (areas.length) {
        document.getElementById('research-areas').innerHTML =
          areas.map(r => `<div class="research-item">${r.trim()}</div>`).join('');
      } else {
        document.getElementById('research-areas').innerHTML =
          '<div class="empty-state"><p>No research areas listed yet.</p></div>';
      }
    })
    .catch(() => {
      document.getElementById('research-areas').innerHTML = '<p style="color:var(--text-muted)">Unable to load research areas.</p>';
    });
}

// ── PUBLICATIONS PAGE ──
if (page === 'publications.html') {
  fetch('/api/publications')
    .then(r => r.json())
    .then(list => {
      const ul = document.getElementById('publications-list');
      if (list.length) {
        ul.innerHTML = list.map(p => `
          <li class="pub-item">
            <div class="pub-title">${p.title}</div>
            <div class="pub-authors">${p.authors || ''}</div>
            <div class="pub-journal">
              ${p.journal ? `<em>${p.journal}</em>` : ''}
              ${p.year ? `<span class="pub-year">${p.year}</span>` : ''}
            </div>
            ${p.doi ? `<div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">DOI: ${p.doi}</div>` : ''}
            ${p.link ? `<a href="${p.link}" target="_blank" class="pub-link">View Paper →</a>` : ''}
          </li>
        `).join('');
      } else {
        ul.innerHTML = '<div class="empty-state"><p>No publications added yet.</p></div>';
      }
    })
    .catch(() => {
      document.getElementById('publications-list').innerHTML = '<p style="color:var(--text-muted)">Unable to load publications.</p>';
    });
}

// ── TEAM PAGE ──
if (page === 'team.html') {
  fetch('/api/team')
    .then(r => r.json())
    .then(list => {
      const grid = document.getElementById('team-grid');
      if (list.length) {
        grid.innerHTML = list.map(m => `
          <div class="team-card">
            <h4>${m.name}</h4>
            <div class="role">${m.role || ''}</div>
            ${m.bio ? `<p>${m.bio}</p>` : ''}
          </div>
        `).join('');
      } else {
        grid.innerHTML = '<div class="empty-state"><p>No team members added yet.</p></div>';
      }
    })
    .catch(() => {
      document.getElementById('team-grid').innerHTML = '<p style="color:var(--text-muted)">Unable to load team.</p>';
    });
}

// ── PROJECTS PAGE ──
if (page === 'projects.html') {
  fetch('/api/projects')
    .then(r => r.json())
    .then(list => {
      const container = document.getElementById('projects-list');
      if (list.length) {
        container.innerHTML = list.map(p => `
          <div class="card">
            <div class="card-meta">
              <span class="tag ${p.status}">${p.status}</span>
              ${p.start_date ? `Started ${p.start_date}` : ''}
              ${p.end_date ? ` — ${p.end_date}` : ''}
            </div>
            <h3>${p.title}</h3>
            ${p.description ? `<p style="color:var(--text-muted); margin-top:8px; font-size:0.92rem;">${p.description}</p>` : ''}
          </div>
        `).join('');
      } else {
        container.innerHTML = '<div class="empty-state"><p>No projects added yet.</p></div>';
      }
    })
    .catch(() => {
      document.getElementById('projects-list').innerHTML = '<p style="color:var(--text-muted)">Unable to load projects.</p>';
    });
}

// ── CONTACT PAGE ──
if (page === 'contact.html') {
  fetch('/api/contact')
    .then(r => r.json())
    .then(d => {
      document.getElementById('contact-info').innerHTML = `
        <div class="contact-block">
          <h3>Lab Details</h3>
          ${d.lab_name ? `<div class="contact-row"><span class="contact-label">Lab</span><span class="contact-value">${d.lab_name}</span></div>` : ''}
          ${d.address ? `<div class="contact-row"><span class="contact-label">Address</span><span class="contact-value">${d.address}</span></div>` : ''}
          ${d.email ? `<div class="contact-row"><span class="contact-label">Email</span><span class="contact-value"><a href="mailto:${d.email}">${d.email}</a></span></div>` : ''}
          ${d.phone ? `<div class="contact-row"><span class="contact-label">Phone</span><span class="contact-value">${d.phone}</span></div>` : ''}
        </div>
        ${d.google_form_link ? `
          <div class="contact-block">
            <h3>Attendance</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:16px;">
              Lab members can mark their attendance using the link below. Please sign in first to access the full attendance portal.
            </p>
            <a href="${d.google_form_link}" target="_blank" class="form-btn">📋 Mark Attendance</a>
          </div>
        ` : ''}
      `;
    })
    .catch(() => {
      document.getElementById('contact-info').innerHTML = '<p style="color:var(--text-muted)">Unable to load contact information.</p>';
    });
}
