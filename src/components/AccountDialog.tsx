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
import { storageService } from '../services/storageService';

interface Account {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (account: Account) => void;
  account?: Account;
  mode: 'add' | 'edit';
}

const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  onClose,
  onSave,
  account,
  mode,
}) => {
  const [formData, setFormData] = useState<Account>({
    title: account?.title || '',
    firstName: account?.firstName || '',
    lastName: account?.lastName || '',
    email: account?.email || '',
    role: account?.role || 'User',
    status: account?.status || 'Active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Account, string>>>({});

  React.useEffect(() => {
    if (account) {
      setFormData(account);
    }
    setErrors({});
  }, [account]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Account, string>> = {};
    
    // Check required fields
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (mode === 'add') {
      // Check for duplicate email only in add mode
      const existingAccounts = storageService.getAccounts();
      if (existingAccounts.some(acc => acc.email === formData.email)) {
        newErrors.email = 'Email already exists';
      }
    }
    if (!formData.role) newErrors.role = 'Role is required';
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
    if (errors[name as keyof Account]) {
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
    if (errors[name as keyof Account]) {
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
      <DialogTitle>{mode === 'add' ? 'Add Account' : 'Edit Account'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!errors.title}>
          <InputLabel>Title</InputLabel>
          <Select
            name="title"
            value={formData.title}
            label="Title"
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="Mr">Mr</MenuItem>
            <MenuItem value="Ms">Ms</MenuItem>
            <MenuItem value="Dr">Dr</MenuItem>
          </Select>
          {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
        <FormControl fullWidth margin="normal" error={!!errors.role}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
          {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
        </FormControl>
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

export default AccountDialog; 