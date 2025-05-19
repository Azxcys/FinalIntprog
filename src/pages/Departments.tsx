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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DepartmentDialog from '../components/DepartmentDialog';
import { Department } from '../services/storageService';
import { apiService } from '../services/apiService';

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load departments and counts
  const loadData = async () => {
    try {
      const [deptData, empData] = await Promise.all([
        apiService.getDepartments(),
        apiService.getEmployees(),
      ]);
      setDepartments(deptData);
      // Count employees per department
      const counts: Record<string, number> = {};
      empData.forEach((emp: any) => {
        counts[emp.department] = (counts[emp.department] || 0) + 1;
      });
      setEmployeeCounts(counts);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to load data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddClick = () => {
    setSelectedDepartment(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteClick = async (departmentToDelete: Department) => {
    try {
      await apiService.deleteDepartment(departmentToDelete.name);
      await loadData();
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to delete department');
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDepartment(undefined);
  };

  const handleSaveDepartment = async (department: Department) => {
    try {
      if (dialogMode === 'add') {
        await apiService.addDepartment(department);
      } else {
        await apiService.updateDepartment(department.name, department);
      }
      await loadData();
      setDialogOpen(false);
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to save department');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {errorMsg && (
        <div style={{ color: 'red', marginBottom: 8 }}>{errorMsg}</div>
      )}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          DEPARTMENTS
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dept. Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Employee Count</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.name}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell>{employeeCounts[department.name] || 0}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(department)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(department)}
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
          Add Department
        </Button>
      </Paper>
      <DepartmentDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveDepartment}
        department={selectedDepartment}
        mode={dialogMode}
      />
    </Container>
  );
};

export default Departments; 