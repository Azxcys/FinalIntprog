import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmployeeDialog from '../components/EmployeeDialog';
import TransferDialog from '../components/TransferDialog';
import WorkflowDialog from '../components/WorkflowDialog';
import RequestDialog from '../components/RequestDialog';
import EmployeeRequestsDialog from '../components/EmployeeRequestsDialog';
import { storageService, Employee, TransferRecord, Request } from '../services/storageService';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState(storageService.getDepartments());
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestHistoryDialogOpen, setRequestHistoryDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [selectedRequest, setSelectedRequest] = useState<Request | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Load initial data
  useEffect(() => {
    storageService.initializeStorage();
    setEmployees(storageService.getEmployees());
    setDepartments(storageService.getDepartments());
    setTransfers(storageService.getTransfers());
    setRequests(storageService.getRequests());
  }, []);

  // Function to generate next employee ID
  const getNextEmployeeId = () => {
    const maxId = employees.reduce((max, employee) => {
      const num = parseInt(employee.id.replace('EMP', ''));
      return num > max ? num : max;
    }, 0);
    return `EMP${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleAddClick = () => {
    setSelectedEmployee(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteClick = (employeeToDelete: Employee) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeToDelete.id);
    setEmployees(updatedEmployees);
    storageService.setEmployees(updatedEmployees);
  };

  const handleTransferClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setTransferDialogOpen(true);
  };

  const handleWorkflowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setWorkflowDialogOpen(true);
  };

  const handleRequestClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setRequestHistoryDialogOpen(true);
  };

  const handleNewRequestClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setRequestDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleTransferDialogClose = () => {
    setTransferDialogOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleWorkflowDialogClose = () => {
    setWorkflowDialogOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleRequestDialogClose = () => {
    setRequestDialogOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleRequestHistoryDialogClose = () => {
    setRequestHistoryDialogOpen(false);
    setSelectedEmployee(undefined);
  };

  const handleEditRequest = (request: Request) => {
    setSelectedRequest(request);
    setDialogMode('edit');
    setRequestDialogOpen(true);
    setRequestHistoryDialogOpen(false);
  };

  const handleDeleteRequest = (request: Request) => {
    storageService.deleteRequest(request.id);
    setRequests(storageService.getRequests());
  };

  const handleSaveEmployee = (employee: Employee) => {
    let updatedEmployees: Employee[];
    if (dialogMode === 'add') {
      updatedEmployees = [...employees, employee];
    } else {
      updatedEmployees = employees.map((e) => (e.id === employee.id ? employee : e));
    }
    setEmployees(updatedEmployees);
    storageService.setEmployees(updatedEmployees);
  };

  const handleTransfer = (newDepartment: string) => {
    if (selectedEmployee) {
      const transfer: TransferRecord = {
        id: `TRF${String(transfers.length + 1).padStart(3, '0')}`,
        employeeId: selectedEmployee.id,
        fromDepartment: selectedEmployee.department,
        toDepartment: newDepartment,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      storageService.addTransfer(transfer);
      setTransfers([...transfers, transfer]);
      
      // Update employee's department
      const updatedEmployee = { ...selectedEmployee, department: newDepartment };
      const updatedEmployees = employees.map(emp =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      storageService.setEmployees(updatedEmployees);
    }
  };

  const handleSaveRequest = (request: Request) => {
    if (dialogMode === 'add') {
      storageService.addRequest(request);
    } else {
      storageService.updateRequest(request);
    }
    setRequests(storageService.getRequests());
    setRequestDialogOpen(false);
    setSelectedRequest(undefined);
  };

  const handleTransferStatusChange = (transferId: string, newStatus: 'Pending' | 'Approved' | 'Disapproved') => {
    const updatedTransfers = transfers.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, status: newStatus }
        : transfer
    );
    setTransfers(updatedTransfers);
    storageService.setTransfers(updatedTransfers);
  };

  // Get account display name
  const getAccountDisplay = (email: string) => {
    const account = storageService.getAccounts().find(a => a.email === email);
    return account ? `${account.title} ${account.firstName} ${account.lastName} (${account.role})` : email;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          EMPLOYEES
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Hire Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{getAccountDisplay(employee.account)}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={employee.status === 'Active' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleWorkflowClick(employee)}
                      >
                        Workflows
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => handleRequestClick(employee)}
                      >
                        Requests
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        onClick={() => handleTransferClick(employee)}
                      >
                        Transfer
                      </Button>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(employee)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(employee)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddClick}
        >
          Add Employee
        </Button>
      </Paper>

      <EmployeeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        mode={dialogMode}
        departments={departments}
        accounts={dialogMode === 'add' ? storageService.getAvailableAccounts() : storageService.getAccounts()}
        nextEmployeeId={getNextEmployeeId()}
      />

      {selectedEmployee && (
        <>
          <TransferDialog
            open={transferDialogOpen}
            onClose={handleTransferDialogClose}
            onTransfer={handleTransfer}
            departments={departments}
            currentDepartment={selectedEmployee.department}
          />
          <WorkflowDialog
            open={workflowDialogOpen}
            onClose={handleWorkflowDialogClose}
            employeeId={selectedEmployee.id}
            transfers={transfers}
            requests={requests}
            department={selectedEmployee.department}
            onTransferStatusChange={handleTransferStatusChange}
          />
          <RequestDialog
            open={requestDialogOpen}
            onClose={handleRequestDialogClose}
            onSave={handleSaveRequest}
            request={selectedRequest || {
              id: storageService.getNextRequestId(),
              type: 'Equipment',
              employeeId: selectedEmployee?.id || '',
              description: '',
              requestDate: new Date().toISOString().split('T')[0],
              items: [{ name: '', quantity: 1 }],
              status: 'Pending'
            }}
            mode={dialogMode}
            employees={[selectedEmployee!]}
            nextRequestId={storageService.getNextRequestId()}
          />
          <EmployeeRequestsDialog
            open={requestHistoryDialogOpen}
            onClose={handleRequestHistoryDialogClose}
            employee={selectedEmployee}
            requests={requests}
            onEditRequest={handleEditRequest}
            onDeleteRequest={handleDeleteRequest}
            onNewRequest={(employee) => {
              setRequestHistoryDialogOpen(false);
              setSelectedEmployee(employee);
              setDialogMode('add');
              setRequestDialogOpen(true);
            }}
          />
        </>
      )}
    </Container>
  );
};

export default Employees; 