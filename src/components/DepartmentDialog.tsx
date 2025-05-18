import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormHelperText,
} from '@mui/material';
import { Department } from '../services/storageService';

interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (department: Department) => void;
  department?: Department;
  mode: 'add' | 'edit';
}

const DepartmentDialog: React.FC<DepartmentDialogProps> = ({
  open,
  onClose,
  onSave,
  department,
  mode,
}) => {
  const [formData, setFormData] = useState<Department>({
    name: department?.name || '',
    description: department?.description || '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  React.useEffect(() => {
    if (department) {
      setFormData(department);
    }
    setErrors({});
  }, [department]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Check required fields
    if (!formData.name) newErrors.name = 'Department name is required';
    if (!formData.description) newErrors.description = 'Description is required';

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
    if (errors[name as keyof typeof errors]) {
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
      <DialogTitle>{mode === 'add' ? 'Add Department' : 'Edit Department'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Dept. Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
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

export default DepartmentDialog; 