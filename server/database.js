const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the server directory
const dbPath = path.join(__dirname, 'users.db');

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    createTables();
  }
});

// Create users table
function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      level INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      last_activity_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists');
      // Ensure completed_tasks column exists
      db.get("PRAGMA table_info(users)", (err, row) => {
        if (err) {
          console.error('Error checking users table columns:', err.message);
        } else {
          db.all("PRAGMA table_info(users)", (err, columns) => {
            if (err) {
              console.error('Error checking users table columns:', err.message);
            } else {
              const hasCompletedTasks = columns.some(col => col.name === 'completed_tasks');
              if (!hasCompletedTasks) {
                db.run('ALTER TABLE users ADD COLUMN completed_tasks TEXT DEFAULT "[]"', (err) => {
                  if (err) {
                    console.error('Error adding completed_tasks column:', err.message);
                  } else {
                    console.log('Added completed_tasks column to users table');
                  }
                });
              }
            }
          });
        }
      });
    }
  });

  // Create mood_history table
  const createMoodHistoryTable = `
    CREATE TABLE IF NOT EXISTS mood_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      mood INTEGER NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `;

  db.run(createMoodHistoryTable, (err) => {
    if (err) {
      console.error('Error creating mood_history table:', err.message);
    } else {
      console.log('Mood history table created or already exists');
    }
  });
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get multiple rows
function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Add mood history helpers
async function addMoodEntry(userId, date, mood, note) {
  return runQuery(
    'INSERT INTO mood_history (user_id, date, mood, note) VALUES (?, ?, ?, ?)',
    [userId, date, mood, note]
  );
}

async function getMoodHistory(userId, limit = 30) {
  return getAll(
    'SELECT date, mood, note FROM mood_history WHERE user_id = ? ORDER BY date DESC LIMIT ?',
    [userId, limit]
  );
}

module.exports = {
  db,
  runQuery,
  getRow,
  getAll,
  addMoodEntry,
  getMoodHistory
}; 