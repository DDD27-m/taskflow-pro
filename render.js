/**
 * render.js — TaskFlow Pro
 * Pure rendering helpers. No state mutation — just DOM output.
 */

/**
 * Format a due-date string into a human-readable label.
 * @param {string} dateStr  ISO date (YYYY-MM-DD)
 * @returns {{ label: string, overdue: boolean } | null}
 */
function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { label: 'Overdue ' + Math.abs(diff) + 'd', overdue: true };
  if (diff === 0) return { label: 'Due today',    overdue: false };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false };
  return {
    label: 'Due ' + d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    overdue: false,
  };
}

/**
 * Build the HTML string for a single task card.
 * @param {object} task
 * @returns {string} HTML
 */
function buildTaskCardHTML(task) {
  const due = formatDue(task.due);
  const dueHTML = due
    ? `<span class="due${due.overdue ? ' overdue' : ''}">${due.label}</span>`
    : '';

  const checkmarkSVG = `
    <svg viewBox="0 0 12 12" class="check-mark">
      <polyline points="2,6 5,9 10,3"/>
    </svg>`;

  return `
    <div class="task-card${task.done ? ' done' : ''}" data-id="${task.id}">
      <div class="checkbox${task.done ? ' checked' : ''}" data-toggle="${task.id}">
        ${task.done ? checkmarkSVG : ''}
      </div>
      <div class="task-body">
        <div class="task-title" title="${escapeHTML(task.title)}">${escapeHTML(task.title)}</div>
        <div class="task-meta">
          <span class="priority-dot p-${task.priority}" title="Priority: ${task.priority}"></span>
          <span class="tag tag-${task.tag}">${TAG_LABELS[task.tag] || task.tag}</span>
          ${dueHTML}
        </div>
      </div>
      <div class="task-right">
        <div class="assignee">${escapeHTML(task.assignee)}</div>
      </div>
    </div>`;
}

/**
 * Render the full task list into #task-list.
 * @param {object[]} tasks    All tasks
 * @param {string}   filter   'all' | 'active' | 'done'
 * @param {string}   query    Search query string
 */
function renderTaskList(tasks, filter, query) {
  const listEl = document.getElementById('task-list');

  // Filter by tab
  let filtered = tasks;
  if (filter === 'active') filtered = tasks.filter(t => !t.done);
  if (filter === 'done')   filtered = tasks.filter(t => t.done);

  // Filter by search query
  if (query.trim()) {
    const q = query.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (TAG_LABELS[t.tag] || '').toLowerCase().includes(q)
    );
  }

  if (!filtered.length) {
    listEl.innerHTML = '<div class="empty-state">No tasks found</div>';
    return;
  }

  const active = filtered.filter(t => !t.done);
  const done   = filtered.filter(t => t.done);
  let html = '';

  if (active.length) {
    if (filter === 'all')
      html += `<div class="section-label">Active — ${active.length}</div>`;
    active.forEach(t => { html += buildTaskCardHTML(t); });
  }

  if (done.length) {
    if (filter === 'all')
      html += `<div class="section-label">Completed — ${done.length}</div>`;
    done.forEach(t => { html += buildTaskCardHTML(t); });
  }

  listEl.innerHTML = html;
}

/**
 * Update the stats bar and nav badges.
 * @param {object[]} tasks
 */
function renderStats(tasks) {
  const active  = tasks.filter(t => !t.done);
  const done    = tasks.filter(t => t.done);
  const today   = new Date(); today.setHours(0,0,0,0);
  const overdue = tasks.filter(t => !t.done && t.due && new Date(t.due + 'T12:00:00') < today);

  const upcoming = tasks.filter(t => {
    if (t.done || !t.due) return false;
    const d = new Date(t.due + 'T12:00:00');
    const diff = Math.round((d - today) / 86400000);
    return diff >= 0 && diff <= 7;
  });

  setText('s-total',    tasks.length);
  setText('s-active',   active.length);
  setText('s-done',     done.length);
  setText('s-overdue',  overdue.length);
  setText('nb-my',      active.length);
  setText('nb-upcoming',upcoming.length);
}

/** Safely set element text */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/** Escape HTML to prevent XSS */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
