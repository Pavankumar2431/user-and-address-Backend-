const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection (local first, then AWS RDS)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Use environment variable or default to local
  user: process.env.DB_USER || 'root', // Use environment variable or default to local user
  password: process.env.DB_PASSWORD || 'pavankumar', // Use environment variable or default to local password
  database: process.env.DB_NAME || 'user_address_db', // Use environment variable or default to local database
  port: process.env.DB_PORT || 3306, // Default to MySQL port
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL Connected...');
});

// Endpoint to register user and address
app.post('/register', (req, res) => {
  const { name, address } = req.body;

  // Check if user already exists
  const userQuery = 'SELECT * FROM User WHERE name = ?';
  db.query(userQuery, [name], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (users.length > 0) {
      // User exists, insert the new address
      const userId = users[0].id;

      const addressQuery = 'INSERT INTO Address (userId, address) VALUES (?, ?)';
      db.query(addressQuery, [userId, address], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        return res.status(200).json({ message: 'New address added successfully!' });
      });
    } else {
      // User does not exist, create a new user and address
      const insertUserQuery = 'INSERT INTO User (name) VALUES (?)';
      db.query(insertUserQuery, [name], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const newUserId = result.insertId;

        // Insert address for the new user
        const addressQuery = 'INSERT INTO Address (userId, address) VALUES (?, ?)';
        db.query(addressQuery, [newUserId, address], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          return res.status(200).json({ message: 'User and address registered successfully!' });
        });
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
