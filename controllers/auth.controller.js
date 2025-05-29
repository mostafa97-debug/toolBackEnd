import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { sign, verify } = jwt;

// LOGIN FUNCTION
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [users] = await pool.execute('SELECT * FROM Users WHERE Username = ?', [username]); // ✅ fixed: pool.execute()

    if (!users.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      id: user.ID,
      username: user.Username,
      userType: user.User_Type
    };

    const token = sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user.ID, username: user.Username, userType: user.User_Type }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// REGISTER FUNCTION
export async function register(req, res) {
  try {
    const { username, password, userType } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT * FROM Users WHERE Username = ?',
      [username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO Users (Username, Password, User_Type) VALUES (?, ?, ?)',
      [username, hashedPassword, userType || 'user']
    );

    // Auto-login by returning token
    const token = sign(
      { id: result.insertId, username, userType: userType || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.insertId,
        username,
        userType: userType || 'user'
      }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
