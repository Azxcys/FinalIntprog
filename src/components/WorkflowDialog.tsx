import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
} from '@mui/material';
import { TransferRecord, Request } from '../services/storageService';

interface WorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  transfers: TransferRecord[];
  requests: Request[];
  department: string;
  onTransferStatusChange: (transferId: string, newStatus: 'Pending' | 'Approved' | 'Disapproved') => void;
}

const WorkflowDialog: React.FC<WorkflowDialogProps> = ({
  open,
  onClose,
  employeeId,
  transfers,
  requests,
  department,
  onTransferStatusChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const employeeTransfers = transfers.filter(t => t.employeeId === employeeId);
  const employeeRequests = requests.filter(r => r.employeeId === employeeId);

  // Combine and sort all workflow items
  const workflowItems = [
    // Onboarding record
    {
      id: 'onboarding',
      type: 'onboarding',
      date: new Date().toISOString().split('T')[0],
      details: `OnBoarding on ${department}`,
      description: '',
      status: 'Approved',
      action: ''
    },
    // Transfer records
    ...employeeTransfers.map(transfer => ({
      id: transfer.id,
      type: 'transfer',
      date: transfer.date,
      details: `Employee Transferred From ${transfer.fromDepartment} to ${transfer.toDepartment}`,
      description: '',
      status: transfer.status || 'Pending',
      action: ''
    })),
    // Request records
    ...employeeRequests.map(request => ({
      id: request.id,
      type: 'request',
      date: request.requestDate,
      details: `Requested ${request.type}: ${request.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}`,
      description: request.description,
      status: request.status,
      action: ''
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'success';
      case 'Disapproved':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Workflow History</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflowItems
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.details}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {item.type === 'transfer' && (
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={item.status}
                          onChange={(e) => onTransferStatusChange(item.id, e.target.value as 'Pending' | 'Approved' | 'Disapproved')}
                          size="small"
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Approved">Approved</MenuItem>
                          <MenuItem value="Disapproved">Disapproved</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {workflowItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No workflow history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={workflowItems.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkflowDialog; 