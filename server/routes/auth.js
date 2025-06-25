const express = require('express');
const { runQuery, getRow, addMoodEntry, getMoodHistory } = require('../database');
const { hashPassword, comparePassword, generateToken, authenticateToken } = require('../auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if email already exists
    const existingUser = await getRow(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user (with empty completed_tasks)
    const result = await runQuery(
      'INSERT INTO users (first_name, last_name, email, password, level, points, streak, completed_tasks) VALUES (?, ?, ?, ?, 0, 0, 0, ?)',
      [first_name, last_name, email, hashedPassword, JSON.stringify([])]
    );

    // Generate token
    const token = generateToken(result.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.id,
        first_name,
        last_name,
        email,
        level: 0,
        points: 0,
        streak: 0,
        completed_tasks: []
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await getRow(
      'SELECT id, first_name, last_name, email, password, level, points, streak, completed_tasks FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        level: user.level,
        points: user.points,
        streak: user.streak,
        completed_tasks: user.completed_tasks ? JSON.parse(user.completed_tasks) : []
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Fetch user info from DB using req.userId
    const user = await getRow(
      'SELECT id, first_name, last_name, email, level, points, streak, completed_tasks FROM users WHERE id = ?',
      [req.userId]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: {
      ...user,
      completed_tasks: user.completed_tasks ? JSON.parse(user.completed_tasks) : []
    }});
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Update user stats (level, points, streak)
router.post('/update-stats', authenticateToken, async (req, res) => {
  try {
    const { level, points, streak } = req.body;
    if (typeof level !== 'number' || typeof points !== 'number' || typeof streak !== 'number') {
      return res.status(400).json({ error: 'level, points, and streak must be numbers' });
    }
    await runQuery(
      'UPDATE users SET level = ?, points = ?, streak = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [level, points, streak, req.userId]
    );
    res.json({ message: 'User stats updated successfully' });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user activity (points, streak, last_activity_date)
router.post('/update-activity', authenticateToken, async (req, res) => {
  try {
    const { points = 0 } = req.body;
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    // Get current streak, last_activity_date, points, and level
    const user = await getRow(
      'SELECT streak, last_activity_date, points, level FROM users WHERE id = ?',
      [userId]
    );
    let newStreak = 1;
    if (user.last_activity_date) {
      const lastDate = user.last_activity_date;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === today) {
        newStreak = user.streak; // already counted today
      } else if (lastDate === yesterday) {
        newStreak = user.streak + 1; // consecutive day
      } else {
        newStreak = 1; // missed a day
      }
    }
    const newPoints = (user.points || 0) + points;

    // Level thresholds
    const levelThresholds = [0, 200, 1000, 2500, 5000, 10000]; // Add more as needed
    let newLevel = 1;
    for (let i = 0; i < levelThresholds.length; i++) {
      if (newPoints >= levelThresholds[i]) {
        newLevel = i + 1;
      } else {
        break;
      }
    }

    await runQuery(
      'UPDATE users SET points = ?, streak = ?, last_activity_date = ?, level = ? WHERE id = ?',
      [newPoints, newStreak, today, newLevel, userId]
    );
    res.json({ message: 'Activity updated', points: newPoints, streak: newStreak, last_activity_date: today, level: newLevel });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get completed tasks (protected route)
router.get('/completed-tasks', authenticateToken, async (req, res) => {
  try {
    const user = await getRow('SELECT completed_tasks FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ completed_tasks: user.completed_tasks ? JSON.parse(user.completed_tasks) : [] });
  } catch (error) {
    console.error('Get completed tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update completed tasks (protected route)
router.post('/completed-tasks', authenticateToken, async (req, res) => {
  try {
    const { completed_tasks } = req.body;
    if (!Array.isArray(completed_tasks)) {
      return res.status(400).json({ error: 'completed_tasks must be an array' });
    }
    await runQuery('UPDATE users SET completed_tasks = ? WHERE id = ?', [JSON.stringify(completed_tasks), req.userId]);
    res.json({ message: 'Completed tasks updated successfully' });
  } catch (error) {
    console.error('Update completed tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add mood entry (protected route)
router.post('/mood', authenticateToken, async (req, res) => {
  try {
    const { mood, note } = req.body;
    console.log('POST /mood', { userId: req.userId, mood, note });
    if (typeof mood !== 'number' || mood < 1 || mood > 5) {
      return res.status(400).json({ error: 'Mood must be a number between 1 and 5' });
    }
    const date = new Date().toISOString().split('T')[0];
    await addMoodEntry(req.userId, date, mood, note || '');
    console.log('Mood entry added for user:', req.userId);
    res.json({ message: 'Mood entry added' });
  } catch (error) {
    console.error('Add mood entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mood history (protected route)
router.get('/mood', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const history = await getMoodHistory(req.userId, limit);
    res.json({ mood_history: history });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard (protected route)
router.get('/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { getAll } = require('../database');
    const users = await getAll(`
      SELECT 
        id, 
        first_name, 
        last_name, 
        points, 
        level, 
        streak,
        created_at
      FROM users 
      ORDER BY points DESC, level DESC, streak DESC
      LIMIT 100
    `);
    
    // Format user data for leaderboard
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      points: user.points || 0,
      level: user.level || 0,
      streak: user.streak || 0,
      joined: user.created_at
    }));
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 