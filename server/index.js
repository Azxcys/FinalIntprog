require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
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
  database: process.env.DB_NAME,
  environment: process.env.NODE_ENV || 'development'
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

// REQUESTS CRUD ENDPOINTS
// Get all requests (with items)
app.get('/api/requests', async (req, res) => {
  try {
    const [requests] = await pool.query('SELECT * FROM requests');
    for (const req of requests) {
      const [items] = await pool.query('SELECT name, quantity FROM request_items WHERE requestId = ?', [req.id]);
      req.items = items || [];
    }
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests', details: error.sqlMessage || error.message });
  }
});

// Add request (with items)
app.post('/api/requests', async (req, res) => {
  const { id, type, employeeId, description, requestDate, status, items } = req.body;
  // Validation: reject if any required field is missing or empty
  if (!id || !type || !employeeId || !description || !requestDate || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO requests (id, type, employeeId, description, requestDate, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, type, employeeId, description, requestDate, status]
    );
    if (Array.isArray(items)) {
      for (const item of items) {
        await conn.query(
          'INSERT INTO request_items (requestId, name, quantity) VALUES (?, ?, ?)',
          [id, item.name, item.quantity]
        );
      }
    }
    await conn.commit();
    res.status(201).json({ message: 'Request created' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: 'Failed to create request', details: error.sqlMessage || error.message });
  } finally {
    conn.release();
  }
});

// Edit request (with items)
app.put('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  const { type, employeeId, description, requestDate, status, items } = req.body;
  // Validation: reject if any required field is missing or empty
  if (!id || !type || !employeeId || !description || !requestDate || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE requests SET type=?, employeeId=?, description=?, requestDate=?, status=? WHERE id=?',
      [type, employeeId, description, requestDate, status, id]
    );
    await conn.query('DELETE FROM request_items WHERE requestId=?', [id]);
    if (Array.isArray(items)) {
      for (const item of items) {
        await conn.query(
          'INSERT INTO request_items (requestId, name, quantity) VALUES (?, ?, ?)',
          [id, item.name, item.quantity]
        );
      }
    }
    await conn.commit();
    res.json({ message: 'Request updated' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: 'Failed to update request', details: error.sqlMessage || error.message });
  } finally {
    conn.release();
  }
});

// Delete request (and its items)
app.delete('/api/requests/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM request_items WHERE requestId=?', [id]);
    await conn.query('DELETE FROM requests WHERE id=?', [id]);
    await conn.commit();
    res.json({ message: 'Request deleted' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: 'Failed to delete request', details: error.sqlMessage || error.message });
  } finally {
    conn.release();
  }
});

// TRANSFERS CRUD ENDPOINTS
// Get all transfers
app.get('/api/transfers', async (req, res) => {
  try {
    const [transfers] = await pool.query('SELECT * FROM transfers');
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transfers', details: error.sqlMessage || error.message });
  }
});

// Add transfer
app.post('/api/transfers', async (req, res) => {
  const { id, employeeId, fromDepartment, toDepartment, date, status } = req.body;
  if (!id || !employeeId || !fromDepartment || !toDepartment || !date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'INSERT INTO transfers (id, employeeId, fromDepartment, toDepartment, date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, employeeId, fromDepartment, toDepartment, date, status]
    );
    res.status(201).json({ message: 'Transfer created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transfer', details: error.sqlMessage || error.message });
  }
});

// Edit transfer
app.put('/api/transfers/:id', async (req, res) => {
  const { id } = req.params;
  const { employeeId, fromDepartment, toDepartment, date, status } = req.body;
  if (!id || !employeeId || !fromDepartment || !toDepartment || !date || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'UPDATE transfers SET employeeId=?, fromDepartment=?, toDepartment=?, date=?, status=? WHERE id=?',
      [employeeId, fromDepartment, toDepartment, date, status, id]
    );
    res.json({ message: 'Transfer updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transfer', details: error.sqlMessage || error.message });
  }
});

// Delete transfer
app.delete('/api/transfers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transfers WHERE id=?', [id]);
    res.json({ message: 'Transfer deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transfer', details: error.sqlMessage || error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 