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
import { storageService, Department } from '../services/storageService';

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Load departments and counts
  useEffect(() => {
    storageService.initializeStorage();
    const loadedDepartments = storageService.getDepartments();
    const counts = storageService.getAllDepartmentCounts();
    setDepartments(loadedDepartments);
    setEmployeeCounts(counts);
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

  const handleDeleteClick = (departmentToDelete: Department) => {
    const updatedDepartments = departments.filter(
      (dept) => dept.name !== departmentToDelete.name
    );
    setDepartments(updatedDepartments);
    storageService.setDepartments(updatedDepartments);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDepartment(undefined);
  };

  const handleSaveDepartment = (department: Department) => {
    let updatedDepartments: Department[];
    if (dialogMode === 'add') {
      updatedDepartments = [...departments, department];
    } else {
      updatedDepartments = departments.map((d) =>
        d.name === selectedDepartment?.name ? department : d
      );
    }
    setDepartments(updatedDepartments);
    storageService.setDepartments(updatedDepartments);
  };

  // Update counts when employees change
  useEffect(() => {
    const handleStorageChange = () => {
      const counts = storageService.getAllDepartmentCounts();
      setEmployeeCounts(counts);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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