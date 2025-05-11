const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = './users.json';

// Load existing users
let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// Signup
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ message: 'User exists' });
  users[username] = { password, demats: [] };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.json({ message: 'Signup successful' });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful' });
});

// Save demat
app.post('/api/demat', (req, res) => {
  const { username, demat } = req.body;
  if (!users[username]) return res.status(404).json({ message: 'User not found' });
  users[username].demats.push(demat);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.json({ message: 'Demat saved' });
});

// Get demats
app.get('/api/demats/:username', (req, res) => {
  const username = req.params.username;
  if (!users[username]) return res.status(404).json({ message: 'User not found' });
  res.json({ demats: users[username].demats });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
