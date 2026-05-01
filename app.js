/**
 * app.js — TaskFlow Pro
 * Application controller: state, events, and orchestration.
 */

/* ---- State ---- */
let tasks   = loadTasks();
let nextId  = loadNextId(tasks);
let filter  = 'all';
let query   = '';
let sortMode = 'default'; // 'default' | 'priority' | 'due'

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  render();
  bindEvents();
});

/* ---- Render ---- */
function render() {
  const sorted = sortTasks([...tasks], sortMode);
  renderTaskList(sorted, filter, query);
  renderStats(tasks);
  saveTasks(tasks);
}

/* ---- Sort ---- */
const PRIORITY_ORDER = { high: 0, med: 1, low: 2 };

function sortTasks(list, mode) {
  if (mode === 'priority') {
    return list.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9));
  }
  if (mode === 'due') {
    return list.sort((a, b) => {
      if (!a.due && !b.due) return 0;
      if (!a.due) return 1;
      if (!b.due) return -1;
      return a.due.localeCompare(b.due);
    });
  }
  // default: incomplete first, then by id desc
  return list.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return b.id - a.id;
  });
}

/* ---- Event Binding ---- */
function bindEvents() {

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      filter = tab.dataset.filter;
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render();
    });
  });

  // Search
  document.getElementById('search-input').addEventListener('input', e => {
    query = e.target.value;
    render();
  });

  // Task list: toggle checkboxes (event delegation)
  document.getElementById('task-list').addEventListener('click', e => {
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      const id = parseInt(toggle.dataset.toggle, 10);
      toggleTask(id);
    }
  });

  // Sort button — cycle through modes
  const sortBtn = document.getElementById('sort-btn');
  const SORT_CYCLE = ['default', 'priority', 'due'];
  const SORT_LABELS = { default: 'Sort', priority: 'By priority', due: 'By due date' };
  sortBtn.addEventListener('click', () => {
    const idx = SORT_CYCLE.indexOf(sortMode);
    sortMode = SORT_CYCLE[(idx + 1) % SORT_CYCLE.length];
    sortBtn.childNodes[sortBtn.childNodes.length - 1].textContent = ' ' + SORT_LABELS[sortMode];
    render();
  });

  // Add task button → open modal
  document.getElementById('add-task-btn').addEventListener('click', openModal);

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  // Save new task
  document.getElementById('save-btn').addEventListener('click', addTask);

  // Allow Enter key in title field to submit
  document.getElementById('new-title').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  // Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ---- Actions ---- */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    render();
  }
}

function openModal() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('new-title').value = '';
  document.getElementById('new-priority').value = 'med';
  document.getElementById('new-due').value = today;
  document.getElementById('new-tag').value = 'blue';
  document.getElementById('new-assignee').value = 'AM';
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('new-title').focus(), 60);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function addTask() {
  const title = document.getElementById('new-title').value.trim();
  if (!title) {
    document.getElementById('new-title').focus();
    return;
  }

  tasks.unshift({
    id:       nextId++,
    title,
    done:     false,
    priority: document.getElementById('new-priority').value,
    tag:      document.getElementById('new-tag').value,
    assignee: document.getElementById('new-assignee').value,
    due:      document.getElementById('new-due').value,
  });

  closeModal();

  // Switch to 'all' or 'active' so the new task is visible
  if (filter === 'done') {
    filter = 'all';
    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.filter === 'all');
    });
  }

  render();
}
