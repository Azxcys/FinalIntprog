import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import { Employee, Department, Account } from '../services/storageService';

interface EmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employee?: Employee;
  mode: 'add' | 'edit';
  departments: Department[];
  accounts: Account[];
  nextEmployeeId: string;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  open,
  onClose,
  onSave,
  employee,
  mode,
  departments,
  accounts,
  nextEmployeeId,
}) => {
  const [formData, setFormData] = useState<Employee>({
    id: employee?.id || nextEmployeeId,
    account: employee?.account || '',
    position: employee?.position || '',
    department: employee?.department || '',
    hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
    status: employee?.status || 'Active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});

  React.useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData(prev => ({
        ...prev,
        id: nextEmployeeId,
      }));
    }
    setErrors({});
  }, [employee, nextEmployeeId]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Employee, string>> = {};
    
    // Check required fields
    if (!formData.account) newErrors.account = 'Account is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof Employee]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user makes a selection
    if (errors[name as keyof Employee]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add Employee' : 'Edit Employee'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Employee ID"
          name="id"
          value={formData.id}
          disabled
        />
        <TextField
          fullWidth
          margin="normal"
          label="Account"
          name="account"
          value={formData.account}
          onChange={handleInputChange}
          error={!!errors.account}
          helperText={errors.account}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          error={!!errors.position}
          helperText={errors.position}
          required
        />
        <FormControl fullWidth margin="normal" error={!!errors.department}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            label="Department"
            onChange={handleSelectChange}
            required
          >
            {departments.map((dept) => (
              <MenuItem key={dept.name} value={dept.name}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
          {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Hire Date"
          name="hireDate"
          type="date"
          value={formData.hireDate}
          onChange={handleInputChange}
          error={!!errors.hireDate}
          helperText={errors.hireDate}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal" error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            label="Status"
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {mode === 'add' ? 'Add' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog; 