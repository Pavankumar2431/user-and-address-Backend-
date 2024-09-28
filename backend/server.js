// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'pavankumar', // Replace with your MySQL password
  database: 'user_address_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
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
