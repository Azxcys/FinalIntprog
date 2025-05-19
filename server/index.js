require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Log database configuration (without password)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to IPT Final 2025 API' });
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
    res.json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed. Full error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// ACCOUNTS CRUD ENDPOINTS
// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM accounts');
    console.log('Accounts fetched:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching accounts. Full error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch accounts',
      details: error.message 
    });
  }
});

// Add account
app.post('/api/accounts', async (req, res) => {
  const { email, title, firstName, lastName, role, status } = req.body;
  try {
    await pool.query(
      'INSERT INTO accounts (email, title, firstName, lastName, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [email, title, firstName, lastName, role, status]
    );
    res.status(201).json({ message: 'Account created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account', details: error.message });
  }
});

// Edit account
app.put('/api/accounts/:email', async (req, res) => {
  const { email } = req.params;
  const { title, firstName, lastName, role, status } = req.body;
  try {
    await pool.query(
      'UPDATE accounts SET title=?, firstName=?, lastName=?, role=?, status=? WHERE email=?',
      [title, firstName, lastName, role, status, email]
    );
    res.json({ message: 'Account updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account', details: error.message });
  }
});

// Delete account
app.delete('/api/accounts/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await pool.query('DELETE FROM accounts WHERE email=?', [email]);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account', details: error.message });
  }
});

// DEPARTMENTS CRUD ENDPOINTS
// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM departments');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
  }
});

// Add department
app.post('/api/departments', async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ message: 'Department created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create department', details: error.message });
  }
});

// Edit department
app.put('/api/departments/:name', async (req, res) => {
  const { name } = req.params;
  const { description } = req.body;
  try {
    await pool.query(
      'UPDATE departments SET description=? WHERE name=?',
      [description, name]
    );
    res.json({ message: 'Department updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update department', details: error.message });
  }
});

// Delete department
app.delete('/api/departments/:name', async (req, res) => {
  const { name } = req.params;
  try {
    await pool.query('DELETE FROM departments WHERE name=?', [name]);
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department', details: error.message });
  }
});

// EMPLOYEES CRUD ENDPOINTS
// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees', details: error.message });
  }
});

// Add employee
app.post('/api/employees', async (req, res) => {
  const { id, account, position, department, hireDate, status } = req.body;
  try {
    await pool.query(
      'INSERT INTO employees (id, account, position, department, hireDate, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, account, position, department, hireDate, status]
    );
    res.status(201).json({ message: 'Employee created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee', details: error.message });
  }
});

// Edit employee
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { account, position, department, hireDate, status } = req.body;
  try {
    await pool.query(
      'UPDATE employees SET account=?, position=?, department=?, hireDate=?, status=? WHERE id=?',
      [account, position, department, hireDate, status, id]
    );
    res.json({ message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee', details: error.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM employees WHERE id=?', [id]);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee', details: error.message });
  }
});

// Add requests endpoint
app.get('/api/requests', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM requests');
    console.log('Requests fetched:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching requests. Full error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch requests',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 