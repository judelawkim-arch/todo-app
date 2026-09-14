const STORAGE_KEY = 'todos';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t) => t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.completed === 'boolean'
    );
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

let tasks = loadTasks();

const form = document.querySelector('.task-form');
const input = document.querySelector('.task-input');
const list = document.querySelector('.task-list');

function render() {
  list.textContent = '';
  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'task-delete';
    del.setAttribute('aria-label', 'Delete task');
    del.textContent = '×';

    li.append(checkbox, span, del);
    list.appendChild(li);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  input.value = '';
  if (!text) return;
  tasks.push({ id: makeId(), text, completed: false });
  saveTasks(tasks);
  render();
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('.task');
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains('task-checkbox')) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.completed = e.target.checked;
      saveTasks(tasks);
      li.classList.toggle('completed', task.completed);
    }
  } else if (e.target.classList.contains('task-delete')) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);
    li.remove();
  }
});

document.addEventListener('DOMContentLoaded', render);
