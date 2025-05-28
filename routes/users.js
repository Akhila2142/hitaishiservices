// routes/user.js
const express = require('express');
const uuid = require('uuid');
const db = require('../db'); // Import the MySQL database connection

const router = express.Router();

// User registration route
router.post('/register', (req, res) => {
  const { full_name, username, email, phone, password, confirm_password, address, pincode, gender } = req.body;

  // Check if passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  // Generate a unique user ID
  const userId = uuid.v4();

  // Insert the user into the database
  const query = `INSERT INTO users (user_id, full_name, username, email, phone, password, address, pincode, gender)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [userId, full_name, username, email, phone, password, address, pincode, gender], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ success: false, message: 'Error registering user' });
    }

    // Successfully registered
    return res.status(200).json({ success: true, message: 'Registration successful' });
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({ success: true, message: 'Login successful', customer: users[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

  // POST /api/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Send UUID along with user info
        const customer = results[0];
        res.json({ success: true, message: 'Login successful', customer });
    });
});

  

module.exports = router;
