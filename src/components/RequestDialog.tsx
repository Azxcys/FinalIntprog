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
  IconButton,
  Box,
  Typography,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { Request, Employee } from '../services/storageService';

interface RequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (request: Request) => void;
  request?: Request;
  mode: 'add' | 'edit';
  employees: Employee[];
  nextRequestId: string;
}

interface FormErrors {
  type?: string;
  employeeId?: string;
  description?: string;
  requestDate?: string;
  items: string[];
}

const RequestDialog: React.FC<RequestDialogProps> = ({
  open,
  onClose,
  onSave,
  request,
  mode,
  employees,
  nextRequestId,
}) => {
  const [formData, setFormData] = useState<Request>({
    id: request?.id || nextRequestId,
    type: request?.type || 'Equipment',
    employeeId: request?.employeeId || '',
    description: request?.description || '',
    requestDate: request?.requestDate || new Date().toISOString().split('T')[0],
    items: request?.items || [{ name: '', quantity: 1 }],
    status: request?.status || 'Pending',
  });

  const [errors, setErrors] = useState<FormErrors>({
    items: [],
  });

  React.useEffect(() => {
    if (request) {
      setFormData(request);
    } else {
      setFormData(prev => ({
        ...prev,
        id: nextRequestId,
      }));
    }
    setErrors({ items: [] });
  }, [request, nextRequestId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      items: [],
    };
    
    // Check required fields
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.requestDate) newErrors.requestDate = 'Request date is required';

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.name) {
        newErrors.items[index] = 'Item name is required';
      }
    });

    setErrors(newErrors);
    return !newErrors.type && !newErrors.employeeId && !newErrors.description && 
           !newErrors.requestDate && newErrors.items.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof Omit<FormErrors, 'items'>]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user makes a selection
    if (errors[name as keyof Omit<FormErrors, 'items'>]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleItemChange = (index: number, field: 'name' | 'quantity', value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
    // Clear item error when user starts typing
    if (errors.items[index]) {
      setErrors(prev => ({
        ...prev,
        items: prev.items.map((err, i) => i === index ? '' : err),
      }));
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
    // Remove error for deleted item
    if (errors.items[index]) {
      setErrors(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleQuantityChange = (index: number, increment: boolean) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      quantity: Math.max(1, newItems[index].quantity + (increment ? 1 : -1)),
    };
    setFormData(prev => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add Request' : 'Edit Request'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Request ID"
          name="id"
          value={formData.id}
          disabled
        />
        <FormControl fullWidth margin="normal" error={!!errors.type}>
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            label="Type"
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="Equipment">Equipment</MenuItem>
            <MenuItem value="Resources">Resources</MenuItem>
            <MenuItem value="Leave">Leave</MenuItem>
          </Select>
          {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth margin="normal" error={!!errors.employeeId}>
          <InputLabel>Employee</InputLabel>
          <Select
            name="employeeId"
            value={formData.employeeId}
            label="Employee"
            onChange={handleSelectChange}
            required
          >
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {`${emp.id} - ${emp.position}`}
              </MenuItem>
            ))}
          </Select>
          {errors.employeeId && <FormHelperText>{errors.employeeId}</FormHelperText>}
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={2}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Request Date"
          name="requestDate"
          type="date"
          value={formData.requestDate}
          onChange={handleInputChange}
          error={!!errors.requestDate}
          helperText={errors.requestDate}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Items</Typography>
        {formData.items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
            <TextField
              label="Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              sx={{ flexGrow: 1 }}
              error={!!errors.items[index]}
              helperText={errors.items[index]}
              required
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(index, false)}
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(index, true)}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {formData.items.length > 1 && (
              <IconButton
                size="small"
                onClick={() => handleRemoveItem(index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddItem}
          sx={{ mt: 1 }}
        >
          Add Item
        </Button>
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

export default RequestDialog; 