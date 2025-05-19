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
import { Account } from '../services/storageService';
import { apiService } from '../services/apiService';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load initial data
  const loadAccounts = async () => {
    try {
      const data = await apiService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  useEffect(() => {
    loadAccounts();
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

  const handleDeleteClick = async (accountToDelete: Account) => {
    try {
      await apiService.deleteAccount(accountToDelete.email);
      await loadAccounts();
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to delete account');
      console.error('Failed to delete account:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAccount(undefined);
  };

  const handleSaveAccount = async (account: Account) => {
    try {
      if (dialogMode === 'add') {
        await apiService.addAccount(account);
      } else {
        await apiService.updateAccount(account.email, account);
      }
      await loadAccounts();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {errorMsg && (
        <div style={{ color: 'red', marginBottom: 8 }}>{errorMsg}</div>
      )}
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
                        onClick={() => handleEditClick(account)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
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
          onClick={handleAddClick}
          sx={{ mt: 2 }}
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