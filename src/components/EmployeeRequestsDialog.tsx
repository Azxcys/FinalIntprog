import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Button,
  Typography,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Request, Employee } from '../services/storageService';

interface EmployeeRequestsDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  requests: Request[];
  onEditRequest: (request: Request) => void;
  onDeleteRequest: (request: Request) => void;
  onNewRequest: (employee: Employee) => void;
}

const EmployeeRequestsDialog: React.FC<EmployeeRequestsDialogProps> = ({
  open,
  onClose,
  employee,
  requests,
  onEditRequest,
  onDeleteRequest,
  onNewRequest,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const employeeRequests = requests
    .filter(req => req.employeeId === employee.id)
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const formatItems = (items: Request['items']) => {
    return items.map(item => `${item.name} x ${item.quantity}`).join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Disapproved':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Request History - {employee.id}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => onNewRequest(employee)}
          >
            New Request
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeRequests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.description}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{formatItems(request.items)}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {request.status === 'Pending' && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => onEditRequest(request)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDeleteRequest(request)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={employeeRequests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeRequestsDialog; 