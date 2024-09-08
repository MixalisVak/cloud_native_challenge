const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = rows[0];

  // Check password
  // Here, the password in the DB is crypted ( the hashed password we had created through hashPassword.js file)
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });

  res.json({ token });
};
