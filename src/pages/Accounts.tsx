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
  Stack,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountDialog from '../components/AccountDialog';
import { storageService, Account } from '../services/storageService';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  // Load initial data
  useEffect(() => {
    storageService.initializeStorage();
    setAccounts(storageService.getAccounts());
  }, []);

  const handleAddClick = () => {
    setSelectedAccount(undefined);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteClick = (accountToDelete: Account) => {
    const updatedAccounts = accounts.filter(account => account.email !== accountToDelete.email);
    setAccounts(updatedAccounts);
    storageService.setAccounts(updatedAccounts);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAccount(undefined);
  };

  const handleSaveAccount = (account: Account) => {
    let updatedAccounts: Account[];
    if (dialogMode === 'add') {
      updatedAccounts = [...accounts, account];
    } else {
      updatedAccounts = accounts.map(a => a.email === selectedAccount?.email ? account : a);
    }
    setAccounts(updatedAccounts);
    storageService.setAccounts(updatedAccounts);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          ACCOUNTS
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.email}>
                  <TableCell>{account.title}</TableCell>
                  <TableCell>{account.firstName}</TableCell>
                  <TableCell>{account.lastName}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={account.status}
                      color={account.status === 'Active' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(account)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(account)}
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
          Add Account
        </Button>
      </Paper>

      <AccountDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveAccount}
        account={selectedAccount}
        mode={dialogMode}
      />
    </Container>
  );
};

export default Accounts; 