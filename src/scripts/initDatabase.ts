import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig = {
  host: '153.92.15.31',
  user: 'u875409848_hmagsayo',
  password: '9T2Z5$3UKkgSYzE',
  database: 'u875409848_hmagsayo'
};

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
  });

  try {
    // Read and execute the SQL setup script
    const setupScript = fs.readFileSync(path.join(__dirname, '../../setup_database.sql'), 'utf8');
    const statements = setupScript.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the initialization
initializeDatabase().catch(console.error); 