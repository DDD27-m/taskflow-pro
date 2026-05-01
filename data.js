/**
 * data.js — TaskFlow Pro
 * Seed data, constants, and local-storage persistence helpers.
 */

const TAG_LABELS = {
  blue:  'Website Redesign',
  amber: 'Q2 Launch',
  green: 'Research',
  gray:  'General',
  red:   'Critical',
};

const SEED_TASKS = [
  {
    id: 1,
    title: 'Audit current homepage layout and document pain points',
    done: false,
    priority: 'high',
    tag: 'blue',
    assignee: 'AM',
    due: offsetDate(-3),   // 3 days ago → overdue
  },
  {
    id: 2,
    title: 'Write Q2 go-to-market strategy brief',
    done: false,
    priority: 'high',
    tag: 'amber',
    assignee: 'JL',
    due: offsetDate(2),
  },
  {
    id: 3,
    title: 'Review user research findings and summarize key themes',
    done: true,
    priority: 'med',
    tag: 'green',
    assignee: 'SR',
    due: offsetDate(-5),
  },
  {
    id: 4,
    title: 'Set up stakeholder review meeting for new brand guidelines',
    done: false,
    priority: 'med',
    tag: 'blue',
    assignee: 'AM',
    due: offsetDate(5),
  },
  {
    id: 5,
    title: 'Update competitor analysis spreadsheet',
    done: false,
    priority: 'low',
    tag: 'gray',
    assignee: 'JL',
    due: offsetDate(9),
  },
  {
    id: 6,
    title: 'Draft copy for landing page hero section',
    done: false,
    priority: 'high',
    tag: 'blue',
    assignee: 'AM',
    due: offsetDate(0),    // due today
  },
];

/** Returns an ISO date string relative to today */
function offsetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/** Load tasks from localStorage, fall back to seed data */
function loadTasks() {
  try {
    const saved = localStorage.getItem('taskflow_tasks');
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(SEED_TASKS)); // deep clone seed
}

/** Persist tasks to localStorage */
function saveTasks(tasks) {
  try {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  } catch (e) { /* ignore */ }
}

/** Load next-id counter */
function loadNextId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}
