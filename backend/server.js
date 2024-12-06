const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
const cors = require('cors');
app.use(cors());

// POST route for registration
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  // Example validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Simulate saving to a database
  const newUser = { username, email, password }; // In real life, you'd save this to a database

  // Respond with success
  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Start server on port 5174
app.listen(5174, () => {
  console.log('Server is running on http://localhost:5174');
});
