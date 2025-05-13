const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

let tasks = [];

// Load tasks from file (if it exists)
const loadTasks = () => {
  try {
    const data = fs.readFileSync('tasks.json', 'utf8');
    tasks = JSON.parse(data);
  } catch (error) {
    tasks = [];
  }
};

// Save tasks to file
const saveTasks = () => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

loadTasks();

// Routes

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const task = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  res.status(201).json(task);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).send('Task not found');

  tasks[index] = { ...tasks[index], ...req.body };
  saveTasks();
  res.json(tasks[index]);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});