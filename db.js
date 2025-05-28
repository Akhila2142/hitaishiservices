// db.js
const mysql = require('mysql2/promise');

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '2142', // Replace with your MySQL password
  database: 'hitaishi_services' // Replace with your database name

  
});

console.log('✅ MySQL Pool Created!');
module.exports = db;


