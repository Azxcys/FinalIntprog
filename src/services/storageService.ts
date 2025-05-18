interface Employee {
  id: string;
  account: string;
  position: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
}

interface Department {
  name: string;
  description: string;
}

interface Account {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface TransferRecord {
  id: string;
  employeeId: string;
  fromDepartment: string;
  toDepartment: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Disapproved';
}

interface Request {
  id: string;
  type: 'Equipment' | 'Leave';
  employeeId: string;
  description: string;
  requestDate: string;
  items: {
    name: string;
    quantity: number;
  }[];
  status: 'Pending' | 'Approved' | 'Disapproved';
}

const STORAGE_KEYS = {
  EMPLOYEES: 'employees',
  DEPARTMENTS: 'departments',
  TRANSFERS: 'transfers',
  ACCOUNTS: 'accounts',
  REQUESTS: 'requests'
};

const initialAccounts: Account[] = [
  {
    title: 'Mr',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    title: 'Mr',
    firstName: 'Employee',
    lastName: 'User',
    email: 'employee@example.com',
    role: 'Employee',
    status: 'Active',
  }
];

const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    account: 'admin@example.com',
    position: 'Developer',
    department: 'Engineering',
    hireDate: '2025-01-01',
    status: 'Active',
  },
  {
    id: 'EMP002',
    account: 'user@example.com',
    position: 'Designer',
    department: 'Marketing',
    hireDate: '2025-02-01',
    status: 'Active',
  },
];

const initialDepartments: Department[] = [
  {
    name: 'Engineering',
    description: 'Software development team',
  },
  {
    name: 'Marketing',
    description: 'Marketing and communications team',
  },
  {
    name: 'Human Resources',
    description: 'HR management and recruitment',
  },
];

const initialRequests: Request[] = [
  {
    id: 'REQ001',
    type: 'Equipment',
    employeeId: 'EMP002',
    description: 'Need laptop for development work',
    requestDate: '2024-03-15',
    items: [{ name: 'Laptop', quantity: 1 }],
    status: 'Pending'
  },
  {
    id: 'REQ002',
    type: 'Leave',
    employeeId: 'EMP001',
    description: 'Annual vacation',
    requestDate: '2024-03-10',
    items: [{ name: 'Vacation', quantity: 5 }],
    status: 'Approved'
  }
];

export const storageService = {
  // Initialize storage with default data if empty
  initializeStorage: () => {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(initialEmployees));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(initialDepartments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSFERS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(initialRequests));
    }
  },

  // Employees
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },

  setEmployees: (employees: Employee[]) => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  // Departments
  getDepartments: (): Department[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
    return data ? JSON.parse(data) : [];
  },

  setDepartments: (departments: Department[]) => {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(departments));
  },

  // Accounts
  getAccounts: (): Account[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : [];
  },

  setAccounts: (accounts: Account[]) => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  // Get available accounts (not already assigned to employees)
  getAvailableAccounts: (): Account[] => {
    const allAccounts = storageService.getAccounts();
    const employees = storageService.getEmployees();
    const usedEmails = new Set(employees.map(emp => emp.account));
    return allAccounts.filter(account => !usedEmails.has(account.email));
  },

  // Transfers
  getTransfers: (): TransferRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
    return data ? JSON.parse(data) : [];
  },

  setTransfers: (transfers: TransferRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transfers));
  },

  addTransfer: (transfer: TransferRecord) => {
    const transfers = storageService.getTransfers();
    transfers.push(transfer);
    storageService.setTransfers(transfers);
  },

  // Department employee count
  getDepartmentEmployeeCount: (departmentName: string): number => {
    const employees = storageService.getEmployees();
    return employees.filter(emp => emp.department === departmentName).length;
  },

  // Get all department counts
  getAllDepartmentCounts: (): Record<string, number> => {
    const employees = storageService.getEmployees();
    const counts: Record<string, number> = {};
    
    employees.forEach(emp => {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    });
    
    return counts;
  },

  // Requests
  getRequests: (): Request[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return data ? JSON.parse(data) : [];
  },

  setRequests: (requests: Request[]) => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  },

  addRequest: (request: Request) => {
    const requests = storageService.getRequests();
    requests.push(request);
    storageService.setRequests(requests);
  },

  updateRequest: (updatedRequest: Request) => {
    const requests = storageService.getRequests();
    const index = requests.findIndex(req => req.id === updatedRequest.id);
    if (index !== -1) {
      requests[index] = updatedRequest;
      storageService.setRequests(requests);
    }
  },

  deleteRequest: (requestId: string) => {
    const requests = storageService.getRequests();
    const filteredRequests = requests.filter(req => req.id !== requestId);
    storageService.setRequests(filteredRequests);
  },

  getNextRequestId: (): string => {
    const requests = storageService.getRequests();
    if (requests.length === 0) return 'REQ001';
    const lastId = requests[requests.length - 1].id;
    const numericPart = parseInt(lastId.slice(3));
    return `REQ${String(numericPart + 1).padStart(3, '0')}`;
  }
};

export type { Employee, Department, TransferRecord, Account, Request }; 