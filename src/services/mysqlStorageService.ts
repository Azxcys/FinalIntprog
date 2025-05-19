import mysql, { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';
import { Employee, Department, Account, TransferRecord, Request } from './storageService';

// Database connection configuration
const dbConfig = {
  host: '153.92.15.31',
  user: 'u875409848_hmagsayo',
  password: '9T2Z5$3UKkgSYzE',
  database: 'u875409848_hmagsayo'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Type definitions for query results
interface RequestRow extends RowDataPacket {
  id: string;
  type: 'Equipment' | 'Leave';
  employeeId: string;
  description: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Disapproved';
}

interface RequestItemRow extends RowDataPacket {
  id: number;
  requestId: string;
  name: string;
  quantity: number;
}

interface CountRow extends RowDataPacket {
  count: number;
}

interface DepartmentCountRow extends RowDataPacket {
  department: string;
  count: number;
}

interface EmployeeRow extends RowDataPacket {
  id: string;
  account: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
}

interface DepartmentRow extends RowDataPacket {
  name: string;
  description: string;
}

interface AccountRow extends RowDataPacket {
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface TransferRow extends RowDataPacket {
  id: string;
  employeeId: string;
  fromDepartment: string;
  toDepartment: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Disapproved';
}

export const mysqlStorageService = {
  // Initialize database connection
  async initializeConnection() {
    try {
      const connection = await pool.getConnection();
      connection.release();
      console.log('Database connection established');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    const [rows] = await pool.query<EmployeeRow[]>('SELECT * FROM employees');
    return rows;
  },

  async setEmployees(employees: Employee[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Clear existing employees
      await connection.query('DELETE FROM employees');
      
      // Insert new employees
      for (const employee of employees) {
        await connection.query(
          'INSERT INTO employees (id, account, position, department, hireDate, status) VALUES (?, ?, ?, ?, ?, ?)',
          [employee.id, employee.account, employee.position, employee.department, employee.hireDate, employee.status]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    const [rows] = await pool.query<DepartmentRow[]>('SELECT * FROM departments');
    return rows;
  },

  async setDepartments(departments: Department[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Clear existing departments
      await connection.query('DELETE FROM departments');
      
      // Insert new departments
      for (const dept of departments) {
        await connection.query(
          'INSERT INTO departments (name, description) VALUES (?, ?)',
          [dept.name, dept.description]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const [rows] = await pool.query<AccountRow[]>('SELECT * FROM accounts');
    return rows;
  },

  async setAccounts(accounts: Account[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Clear existing accounts
      await connection.query('DELETE FROM accounts');
      
      // Insert new accounts
      for (const account of accounts) {
        await connection.query(
          'INSERT INTO accounts (email, title, firstName, lastName, role, status) VALUES (?, ?, ?, ?, ?, ?)',
          [account.email, account.title, account.firstName, account.lastName, account.role, account.status]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getAvailableAccounts(): Promise<Account[]> {
    const [rows] = await pool.query<AccountRow[]>(`
      SELECT a.* FROM accounts a
      LEFT JOIN employees e ON a.email = e.account
      WHERE e.id IS NULL
    `);
    return rows;
  },

  // Transfers
  async getTransfers(): Promise<TransferRecord[]> {
    const [rows] = await pool.query<TransferRow[]>('SELECT * FROM transfers');
    return rows;
  },

  async setTransfers(transfers: TransferRecord[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Clear existing transfers
      await connection.query('DELETE FROM transfers');
      
      // Insert new transfers
      for (const transfer of transfers) {
        await connection.query(
          'INSERT INTO transfers (id, employeeId, fromDepartment, toDepartment, date, status) VALUES (?, ?, ?, ?, ?, ?)',
          [transfer.id, transfer.employeeId, transfer.fromDepartment, transfer.toDepartment, transfer.date, transfer.status]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async addTransfer(transfer: TransferRecord): Promise<void> {
    await pool.query(
      'INSERT INTO transfers (id, employeeId, fromDepartment, toDepartment, date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [transfer.id, transfer.employeeId, transfer.fromDepartment, transfer.toDepartment, transfer.date, transfer.status]
    );
  },

  // Requests
  async getRequests(): Promise<Request[]> {
    const [requests] = await pool.query<RequestRow[]>('SELECT * FROM requests');
    const [items] = await pool.query<RequestItemRow[]>('SELECT * FROM request_items');
    
    return requests.map(request => ({
      ...request,
      items: items
        .filter(item => item.requestId === request.id)
        .map(item => ({ name: item.name, quantity: item.quantity }))
    }));
  },

  async setRequests(requests: Request[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Clear existing requests and items
      await connection.query('DELETE FROM request_items');
      await connection.query('DELETE FROM requests');
      
      // Insert new requests and items
      for (const request of requests) {
        await connection.query(
          'INSERT INTO requests (id, type, employeeId, description, requestDate, status) VALUES (?, ?, ?, ?, ?, ?)',
          [request.id, request.type, request.employeeId, request.description, request.requestDate, request.status]
        );
        
        for (const item of request.items) {
          await connection.query(
            'INSERT INTO request_items (requestId, name, quantity) VALUES (?, ?, ?)',
            [request.id, item.name, item.quantity]
          );
        }
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async addRequest(request: Request): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.query(
        'INSERT INTO requests (id, type, employeeId, description, requestDate, status) VALUES (?, ?, ?, ?, ?, ?)',
        [request.id, request.type, request.employeeId, request.description, request.requestDate, request.status]
      );
      
      for (const item of request.items) {
        await connection.query(
          'INSERT INTO request_items (requestId, name, quantity) VALUES (?, ?, ?)',
          [request.id, item.name, item.quantity]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async updateRequest(request: Request): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.query(
        'UPDATE requests SET type = ?, employeeId = ?, description = ?, requestDate = ?, status = ? WHERE id = ?',
        [request.type, request.employeeId, request.description, request.requestDate, request.status, request.id]
      );
      
      // Delete existing items
      await connection.query('DELETE FROM request_items WHERE requestId = ?', [request.id]);
      
      // Insert new items
      for (const item of request.items) {
        await connection.query(
          'INSERT INTO request_items (requestId, name, quantity) VALUES (?, ?, ?)',
          [request.id, item.name, item.quantity]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async deleteRequest(requestId: string): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Delete request items (will cascade delete due to foreign key)
      await connection.query('DELETE FROM requests WHERE id = ?', [requestId]);
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getNextRequestId(): Promise<string> {
    const [rows] = await pool.query<RequestRow[]>('SELECT id FROM requests ORDER BY id DESC LIMIT 1');
    if (!Array.isArray(rows) || rows.length === 0) return 'REQ001';
    
    const lastId = rows[0].id;
    const numericPart = parseInt(lastId.slice(3));
    return `REQ${String(numericPart + 1).padStart(3, '0')}`;
  },

  // Department counts
  async getDepartmentEmployeeCount(departmentName: string): Promise<number> {
    const [rows] = await pool.query<CountRow[]>(
      'SELECT COUNT(*) as count FROM employees WHERE department = ?',
      [departmentName]
    );
    return rows[0].count;
  },

  async getAllDepartmentCounts(): Promise<Record<string, number>> {
    const [rows] = await pool.query<DepartmentCountRow[]>(`
      SELECT department, COUNT(*) as count 
      FROM employees 
      GROUP BY department
    `);
    
    const counts: Record<string, number> = {};
    rows.forEach(row => {
      counts[row.department] = row.count;
    });
    
    return counts;
  }
}; 