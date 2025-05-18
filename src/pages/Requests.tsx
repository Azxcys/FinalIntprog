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
  Chip,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import { storageService, Request, Employee } from '../services/storageService';
import RequestDialog from '../components/RequestDialog';

const Requests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRequestForMenu, setSelectedRequestForMenu] = useState<Request | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRequests = storageService.getRequests();
    // Sort requests by type (alphabetically)
    const sortedRequests = [...allRequests].sort((a, b) => a.type.localeCompare(b.type));
    setRequests(sortedRequests);
    setEmployees(storageService.getEmployees());
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleAddClick = () => {
    setSelectedRequest(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditClick = (request: Request) => {
    setSelectedRequest(request);
    setDialogMode('edit');
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (request: Request) => {
    storageService.deleteRequest(request.id);
    loadData();
    handleMenuClose();
  };

  const handleStatusChange = (request: Request, newStatus: 'Pending' | 'Approved' | 'Disapproved') => {
    const updatedRequest = { ...request, status: newStatus };
    storageService.updateRequest(updatedRequest);
    loadData();
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, request: Request) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRequestForMenu(request);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRequestForMenu(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRequest(undefined);
  };

  const handleSaveRequest = (request: Request) => {
    if (dialogMode === 'add') {
      storageService.addRequest(request);
    } else {
      storageService.updateRequest(request);
    }
    loadData();
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.position} (${employee.account})` : employeeId;
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            REQUESTS
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClick}
          >
            Add Request
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{getEmployeeName(request.employeeId)}</TableCell>
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
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, request)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={requests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedRequestForMenu && handleStatusChange(selectedRequestForMenu, 'Approved')}>
          <ListItemIcon>
            <CheckCircleIcon color="success" />
          </ListItemIcon>
          <ListItemText>Approve</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedRequestForMenu && handleStatusChange(selectedRequestForMenu, 'Disapproved')}>
          <ListItemIcon>
            <CancelIcon color="error" />
          </ListItemIcon>
          <ListItemText>Disapprove</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedRequestForMenu && handleStatusChange(selectedRequestForMenu, 'Pending')}>
          <ListItemIcon>
            <PendingIcon color="warning" />
          </ListItemIcon>
          <ListItemText>Set Pending</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedRequestForMenu && handleEditClick(selectedRequestForMenu)}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedRequestForMenu && handleDeleteClick(selectedRequestForMenu)}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <RequestDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveRequest}
        request={selectedRequest}
        mode={dialogMode}
        employees={dialogMode === 'add' ? employees : [employees.find(emp => emp.id === selectedRequest?.employeeId)!]}
        nextRequestId={storageService.getNextRequestId()}
      />
    </Container>
  );
};

export default Requests; 