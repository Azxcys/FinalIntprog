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
import { Employee, TransferRecord, Request } from '../services/storageService';
import { apiService } from '../services/apiService';

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]); // Placeholder, implement backend if needed
  const [requests, setRequests] = useState<Request[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestHistoryDialogOpen, setRequestHistoryDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();
  const [selectedRequest, setSelectedRequest] = useState<Request | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load initial data
  const loadData = async () => {
    try {
      const [empData, deptData, reqData] = await Promise.all([
        apiService.getEmployees(),
        apiService.getDepartments(),
        apiService.getRequests(),
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setRequests(reqData);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to load data');
    }
  };

  useEffect(() => {
    loadData();
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

  const handleDeleteClick = async (employeeToDelete: Employee) => {
    try {
      await apiService.deleteEmployee(employeeToDelete.id);
      await loadData();
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to delete employee');
    }
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

  const handleDeleteRequest = async (request: Request) => {
    try {
      await apiService.deleteRequest(request.id);
      await loadData();
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to delete request');
    }
  };

  const handleSaveEmployee = async (employee: Employee) => {
    try {
      if (dialogMode === 'add') {
        await apiService.addEmployee(employee);
      } else {
        await apiService.updateEmployee(employee.id, employee);
      }
      await loadData();
      setDialogOpen(false);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to save employee');
    }
  };

  const handleTransfer = async (newDepartment: string) => {
    if (selectedEmployee) {
      try {
        await apiService.updateEmployee(selectedEmployee.id, {
          ...selectedEmployee,
          department: newDepartment,
        });
        await loadData();
        setTransferDialogOpen(false);
      } catch (error: any) {
        setErrorMsg(error.message || 'Failed to transfer employee');
      }
    }
  };

  const handleSaveRequest = async (request: Request) => {
    try {
      if (dialogMode === 'add') {
        await apiService.addRequest(request);
      } else {
        await apiService.updateRequest(request.id, request);
      }
      await loadData();
      setRequestDialogOpen(false);
      setSelectedRequest(undefined);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to save request');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {errorMsg && (
        <div style={{ color: 'red', marginBottom: 8 }}>{errorMsg}</div>
      )}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          EMPLOYEES
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
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
                  <TableCell>{employee.account}</TableCell>
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
        accounts={[]}
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
            onTransferStatusChange={() => {}}
          />
          <RequestDialog
            open={requestDialogOpen}
            onClose={handleRequestDialogClose}
            onSave={handleSaveRequest}
            request={selectedRequest || {
              id: '',
              type: 'Equipment',
              employeeId: selectedEmployee?.id || '',
              description: '',
              requestDate: new Date().toISOString().split('T')[0],
              items: [{ name: '', quantity: 1 }],
              status: 'Pending'
            }}
            mode={dialogMode}
            employees={[selectedEmployee!]}
            nextRequestId={''}
          />
          <EmployeeRequestsDialog
            open={requestHistoryDialogOpen}
            onClose={handleRequestHistoryDialogClose}
            employee={selectedEmployee}
            requests={requests}
            onEditRequest={handleEditRequest}
            onDeleteRequest={handleDeleteRequest}
            onNewRequest={handleNewRequestClick}
          />
        </>
      )}
    </Container>
  );
};

export default Employees; 