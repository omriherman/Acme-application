import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// project imports
import Avatar from 'components/@extended/Avatar';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import UserAddOutlined from '@ant-design/icons/UserAddOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';

// Mock data - In real app, this would come from API
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'Admin', status: 'Active', avatar: avatar1 },
  { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'Editor', status: 'Active', avatar: avatar2 },
  { id: 3, name: 'Bob Johnson', email: 'bob@acme.com', role: 'Viewer', status: 'Pending', avatar: avatar3 }
];

// ==============================|| USER MANAGEMENT MODAL ||============================== //

export default function UserManagementModal({ open, onClose }) {
  const [users, setUsers] = useState(mockUsers);
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
  };

  const handleRemoveUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleInviteUser = () => {
    if (inviteEmail) {
      const newUser = {
        id: users.length + 1,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Pending',
        avatar: avatar1
      };
      setUsers([...users, newUser]);
      setInviteEmail('');
      setInviteRole('Viewer');
      setInviteMode(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: (theme) => theme.customShadows.z1
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">User Management</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Invite User Section */}
        <Box sx={{ px: 3, pb: 2 }}>
          {!inviteMode ? (
            <Button
              variant="contained"
              startIcon={<UserAddOutlined />}
              onClick={() => setInviteMode(true)}
              fullWidth
              sx={{ textTransform: 'none' }}
            >
              Invite User
            </Button>
          ) : (
            <Stack spacing={1.5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                autoFocus
              />
              <Stack direction="row" spacing={1}>
                <FormControl size="small" sx={{ minWidth: 120 }} onClick={(e) => e.stopPropagation()}>
                  <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleInviteUser} sx={{ textTransform: 'none' }}>
                  Send Invite
                </Button>
                <Button variant="outlined" onClick={() => setInviteMode(false)} sx={{ textTransform: 'none' }}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>

        <Divider />

        {/* User List */}
        <List sx={{ p: 0 }}>
          {users.map((user, index) => (
            <Box key={user.id}>
              <ListItem
                sx={{
                  px: 3,
                  py: 2,
                  '&:hover': {
                    bgcolor: 'secondary.lighter'
                  }
                }}
                secondaryAction={
                  <Stack direction="row" spacing={1} alignItems="center" onClick={(e) => e.stopPropagation()}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'divider' }
                        }}
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Editor">Editor</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton size="small" onClick={() => handleRemoveUser(user.id)} sx={{ color: 'error.main' }}>
                      <DeleteOutlined />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">{user.name}</Typography>
                      <Chip
                        label={user.status}
                        size="small"
                        color={user.status === 'Active' ? 'success' : 'warning'}
                        sx={{ height: 20, fontSize: '0.75rem' }}
                      />
                    </Stack>
                  }
                  secondary={user.email}
                />
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

UserManagementModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
