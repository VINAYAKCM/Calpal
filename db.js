const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open the database file
const db = new sqlite3.Database(path.resolve(__dirname, 'nutrition_tracker.db'), (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create users table
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
);`;

// Create meals table
const mealTable = `CREATE TABLE IF NOT EXISTS meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  food TEXT,
  quantity REAL,
  unit TEXT,
  calories REAL,
  mealType TEXT,
  date TEXT,
  timestamp TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);`;

// Create badges table
const badgeTable = `CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  calorieGoals INTEGER DEFAULT 0,
  mealLogging INTEGER DEFAULT 0,
  consistency INTEGER DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES users(id)
);`;

db.serialize(() => {
  db.run(userTable);
  db.run(mealTable);
  db.run(badgeTable);
});

module.exports = db; 