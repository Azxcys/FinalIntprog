import { Account, TransferRecord } from './storageService';

const API_URL = 'http://localhost:5000/api';

// Generic fetch function
const fetchData = async (endpoint: string) => {
  const response = await fetch(`${API_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
};

// POST, PUT, DELETE helpers for accounts
const postAccount = async (account: Account) => {
  const response = await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!response.ok) throw new Error('Failed to add account');
  return response.json();
};

const putAccount = async (email: string, account: Account) => {
  const response = await fetch(`${API_URL}/accounts/${email}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!response.ok) throw new Error('Failed to update account');
  return response.json();
};

const deleteAccount = async (email: string) => {
  const response = await fetch(`${API_URL}/accounts/${email}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete account');
  return response.json();
};

// POST, PUT, DELETE helpers for departments
const postDepartment = async (department: { name: string; description: string }) => {
  const response = await fetch(`${API_URL}/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(department),
  });
  if (!response.ok) throw new Error('Failed to add department');
  return response.json();
};

const putDepartment = async (name: string, department: { description: string }) => {
  const response = await fetch(`${API_URL}/departments/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(department),
  });
  if (!response.ok) throw new Error('Failed to update department');
  return response.json();
};

const deleteDepartment = async (name: string) => {
  const response = await fetch(`${API_URL}/departments/${name}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete department');
  return response.json();
};

// Employees CRUD
const postEmployee = async (employee: any) => {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error('Failed to add employee');
  return response.json();
};

const putEmployee = async (id: string, employee: any) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!response.ok) throw new Error('Failed to update employee');
  return response.json();
};

const deleteEmployee = async (id: string) => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete employee');
  return response.json();
};

// Requests CRUD
const postRequest = async (request: any) => {
  const response = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to add request');
  return response.json();
};

const putRequest = async (id: string, request: any) => {
  const response = await fetch(`${API_URL}/requests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error('Failed to update request');
  return response.json();
};

const deleteRequest = async (id: string) => {
  const response = await fetch(`${API_URL}/requests/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete request');
  return response.json();
};

// Transfers
const getTransfers = async (): Promise<TransferRecord[]> => {
  const response = await fetch(`${API_URL}/transfers`);
  if (!response.ok) {
    throw new Error('Failed to fetch transfers');
  }
  return response.json();
};

const addTransfer = async (transfer: TransferRecord): Promise<void> => {
  const response = await fetch(`${API_URL}/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transfer),
  });
  if (!response.ok) {
    throw new Error('Failed to create transfer');
  }
};

const updateTransfer = async (id: string, transfer: TransferRecord): Promise<void> => {
  const response = await fetch(`${API_URL}/transfers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transfer),
  });
  if (!response.ok) {
    throw new Error('Failed to update transfer');
  }
};

const deleteTransfer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/transfers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete transfer');
  }
};

// API endpoints
export const apiService = {
  // Get all data
  getAccounts: () => fetchData('accounts'),
  getDepartments: () => fetchData('departments'),
  getEmployees: () => fetchData('employees'),
  getRequests: () => fetchData('requests'),
  // Accounts CRUD
  addAccount: postAccount,
  updateAccount: putAccount,
  deleteAccount: deleteAccount,
  // Departments CRUD
  addDepartment: postDepartment,
  updateDepartment: putDepartment,
  deleteDepartment: deleteDepartment,
  // Employees CRUD
  addEmployee: postEmployee,
  updateEmployee: putEmployee,
  deleteEmployee: deleteEmployee,
  // Requests CRUD
  addRequest: postRequest,
  updateRequest: putRequest,
  deleteRequest: deleteRequest,
  // Transfers
  getTransfers: getTransfers,
  addTransfer: addTransfer,
  updateTransfer: updateTransfer,
  deleteTransfer: deleteTransfer,
}; 