const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// BMI calculation endpoint
app.post('/api/calculate-bmi', (req, res) => {
  const { height, weight, age, gender } = req.body;
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Determine BMI category
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi < 25) category = 'Normal weight';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else category = 'Obese';
  
  res.json({
    bmi: bmi.toFixed(2),
    category,
    age,
    gender
  });
});

// User registration
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.run(query, [name, email, password], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already registered.' });
      }
      return res.status(500).json({ error: 'Database error.' });
    }
    res.json({ message: 'Registration successful', userId: this.lastID });
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const query = 'SELECT id, name FROM users WHERE email = ? AND password = ?';
  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json({ message: 'Login successful', userId: row.id, name: row.name });
  });
});

// Add a meal
app.post('/api/meals', (req, res) => {
  const { userId, food, quantity, unit, calories, mealType, date, timestamp } = req.body;
  if (!userId || !food || !quantity || !unit || !calories || !mealType || !date || !timestamp) {
    return res.status(400).json({ error: 'All meal fields are required.' });
  }
  const query = `INSERT INTO meals (user_id, food, quantity, unit, calories, mealType, date, timestamp)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [userId, food, quantity, unit, calories, mealType, date, timestamp], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    res.json({ message: 'Meal logged successfully', mealId: this.lastID });
  });
});

// Get meals for a user and date
app.get('/api/meals', (req, res) => {
  const { userId, date } = req.query;
  if (!userId || !date) {
    return res.status(400).json({ error: 'userId and date are required as query parameters.' });
  }
  const query = `SELECT * FROM meals WHERE user_id = ? AND date = ? ORDER BY timestamp DESC`;
  db.all(query, [userId, date], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    res.json({ meals: rows });
  });
});

// Get badges for a user
app.get('/api/badges', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required as a query parameter.' });
  }
  const query = 'SELECT calorieGoals, mealLogging, consistency FROM badges WHERE user_id = ?';
  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!row) {
      // If no badge row exists, return zeros
      return res.json({ calorieGoals: 0, mealLogging: 0, consistency: 0 });
    }
    res.json(row);
  });
});

// Update badges for a user
app.post('/api/badges', (req, res) => {
  const { userId } = req.body;
  // Default to 0 if not provided
  const calorieGoals = Number(req.body.calorieGoals) || 0;
  const mealLogging = Number(req.body.mealLogging) || 0;
  const consistency = Number(req.body.consistency) || 0;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }
  // Upsert logic: update if exists, insert if not
  const selectQuery = 'SELECT id FROM badges WHERE user_id = ?';
  db.get(selectQuery, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }
    if (row) {
      // Update existing
      const updateQuery = 'UPDATE badges SET calorieGoals = ?, mealLogging = ?, consistency = ? WHERE user_id = ?';
      db.run(updateQuery, [calorieGoals, mealLogging, consistency, userId], function(err2) {
        if (err2) {
          return res.status(500).json({ error: 'Database error.' });
        }
        res.json({ message: 'Badges updated.' });
      });
    } else {
      // Insert new
      const insertQuery = 'INSERT INTO badges (user_id, calorieGoals, mealLogging, consistency) VALUES (?, ?, ?, ?)';
      db.run(insertQuery, [userId, calorieGoals, mealLogging, consistency], function(err2) {
        if (err2) {
          return res.status(500).json({ error: 'Database error.' });
        }
        res.json({ message: 'Badges created.' });
      });
    }
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 