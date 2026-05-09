const db = require('../config/db');

class User {
  static async create(name, email, password) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateResetToken(email, token, expiry) {
    await db.execute(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [token, expiry, email]
    );
  }

  static async findByResetToken(token) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE reset_token = ?',
      [token]
    );
    return rows[0];
  }

  static async updatePassword(email, newPassword) {
    await db.execute(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
      [newPassword, email]
    );
  }

  static async createTable() {
    // Check if table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      await db.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          reset_token VARCHAR(255),
          reset_token_expiry BIGINT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      // Add missing columns if they don't exist
      try { await db.execute('ALTER TABLE users ADD COLUMN name VARCHAR(255) AFTER id'); } catch(e) {}
      try { await db.execute('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)'); } catch(e) {}
      try { await db.execute('ALTER TABLE users ADD COLUMN reset_token_expiry BIGINT'); } catch(e) {}
    }
  }
}

module.exports = User;