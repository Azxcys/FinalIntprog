import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Department } from '../services/storageService';

interface TransferDialogProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (newDepartment: string) => void;
  departments: Department[];
  currentDepartment: string;
}

const TransferDialog: React.FC<TransferDialogProps> = ({
  open,
  onClose,
  onTransfer,
  departments,
  currentDepartment,
}) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState(currentDepartment);

  const handleChange = (e: SelectChangeEvent) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSubmit = () => {
    onTransfer(selectedDepartment);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Transfer Employee</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>New Department</InputLabel>
          <Select
            value={selectedDepartment}
            label="New Department"
            onChange={handleChange}
          >
            {departments
              .filter((dept) => dept.name !== currentDepartment)
              .map((dept) => (
                <MenuItem key={dept.name} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={selectedDepartment === currentDepartment}
        >
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferDialog; 