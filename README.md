# TaskFlow Pro

A clean, professional task management web application built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools required.

![TaskFlow Pro](https://img.shields.io/badge/status-complete-brightgreen) ![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## Features

- **Add tasks** with title, priority, due date, project tag, and assignee
- **Complete tasks** by clicking the circular checkbox
- **Filter** between All, Active, and Completed views
- **Search** tasks by name or project tag
- **Sort** tasks by default order, priority, or due date
- **Overdue detection** — tasks past their due date are highlighted automatically
- **Stats bar** tracking total, active, done, and overdue counts
- **Persistent storage** — tasks saved to `localStorage` and survive page reloads
- **Responsive design** — works on desktop and mobile

---

## Project Structure

```
taskflow-pro/
├── index.html          # Main HTML — layout and modal markup
├── css/
│   └── style.css       # All styles — layout, components, responsive
├── js/
│   ├── data.js         # Seed data, localStorage helpers, constants
│   ├── render.js       # Pure DOM rendering functions
│   └── app.js          # App state, event binding, actions
└── README.md
```

### File Responsibilities

| File | Role |
|------|------|
| `index.html` | Page structure, sidebar, task list container, modal |
| `css/style.css` | CSS variables, layout (flexbox), component styles, responsive breakpoints |
| `js/data.js` | Seed tasks, `TAG_LABELS` map, `loadTasks()`, `saveTasks()`, `loadNextId()` |
| `js/render.js` | `renderTaskList()`, `renderStats()`, `buildTaskCardHTML()`, `formatDue()` |
| `js/app.js` | State (`tasks`, `filter`, `query`, `sortMode`), event listeners, `toggleTask()`, `addTask()` |

---

## Getting Started

No installation or build step needed.

### Option 1 — Open directly
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/taskflow-pro.git
cd taskflow-pro

# Open in browser
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

### Option 2 — Local dev server (recommended)
```bash
# Using Python
python3 -m http.server 3000

# Using Node.js (npx)
npx serve .

# Then open http://localhost:3000
```

---

## Usage

| Action | How |
|--------|-----|
| Add a task | Click **Add task** button (top right) |
| Complete a task | Click the circle checkbox on the left |
| Filter tasks | Use the All / Active / Completed tabs |
| Search | Type in the search box |
| Sort | Click the **Sort** button to cycle: Default → Priority → Due date |

---

## Design Decisions

- **Vanilla JS** — No dependencies, loads instantly, easy to understand and extend
- **CSS Variables** — All colors and radii defined in `:root` for easy theming
- **Separation of concerns** — Data, rendering, and app logic in separate files
- **LocalStorage persistence** — Tasks survive page reloads without a backend
- **XSS-safe rendering** — All user content escaped via `escapeHTML()` before insertion

---

## Extending

Ideas for future features:
- [ ] Drag-and-drop reordering
- [ ] Kanban board view
- [ ] Multiple assignees / team support
- [ ] Backend API integration (Node/Express or Supabase)
- [ ] Dark mode toggle
- [ ] Export to CSV

---

## License

MIT — free to use, modify, and distribute.
