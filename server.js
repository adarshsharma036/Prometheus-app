require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, password], err => {
    if (err) return res.status(400).send("User already exists or DB error");
    res.send("Signup successful");
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT name, email FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err || !row) return res.status(401).send("Invalid credentials");
    res.json({ success: true, user: row });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
