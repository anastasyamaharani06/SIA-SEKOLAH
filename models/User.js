const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUsernameOrEmail(identifier) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identifier, identifier]
    );
    return rows[0] || null;
  },

  async create({ username, email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'siswa']
    );
    return result.insertId;
  },

  async update(id, { username, email, role }) {
    await pool.query(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );
  },

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = User;

