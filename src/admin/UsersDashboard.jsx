import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import UserPetsModal from './UserPetsModal';
import { SERVER_URL } from '../api';
import AdminTable from './AdminTable'; 

const itemsPerPage = 8;

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);
  const [showUserPetsModal, setShowUserPetsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState('user');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users`);
      const modifiedUsers = response.data.map(user => ({ ...user, id: user._id }));
      modifiedUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
      setUsers(modifiedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserPetsClick = async (user) => {
    setSelectedUser(user);
    setShowUserPetsModal(true);
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setShowDeleteWarningModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (!selectedUser || !selectedUser.id) {
        console.error('Invalid user or user ID');
        return;
      }
      await deleteUser(selectedUser.id);
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setShowDeleteWarningModal(false);
    }
  };

  const handleSaveRole = async () => {
    try {
      if (!selectedUser || !selectedUser.id) {
        console.error('Invalid user or user ID');
        return;
      }
      await updateUser(selectedUser.id, { role: selectedUserRole });
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, role: selectedUserRole };
        }
        return user;
      });
      setUsers(updatedUsers);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleOpenConfirmationModal = async (user) => {
    setSelectedUser(user);
    try {
      const response = await axios.get(`${SERVER_URL}/users/profile/${user.id}/role`);
      setSelectedUserRole(response.data.role);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      await axios.put(`${SERVER_URL}/users/profile/${userId}`, userData);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      if (!userId) {
        console.error('Invalid user ID');
        return;
      }
      await axios.delete(`${SERVER_URL}/users/${userId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCloseModals = () => {
    setShowConfirmationModal(false);
    setShowDeleteWarningModal(false);
    setShowUserPetsModal(false);
  };

  const columns = [
    { key: 'id', label: "User's ID" },
    { key: 'firstName', label: 'First Name' },
    { key: 'email', label: 'Email' },
    { key: 'shortBio', label: 'Short Bio' },
  ];

  const actions = [
    {
      label: 'View Pets',
      onClick: (user) => handleUserPetsClick(user),
    },
    {
      label: 'Edit Role',
      onClick: (user) => handleOpenConfirmationModal(user),
    },
    {
      label: 'Delete',
      onClick: (user) => handleDeleteUserClick(user),
    },
  ];

  return (
    <div
      className="admin-dashboard-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '100px', 
        padding: '16px',
        width: '100%',
      }}
    >
      <div className="status-counts" style={{ marginBottom: '20px' }}>
        <span className="dashboard-counter">Total Accounts: {users.length}</span>
      </div>
  
      {loading ? (
        <CircularProgress />
      ) : (
        <div
          style={{
            width: '80%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <AdminTable
            data={users}
            columns={columns}
            actions={actions}
            loading={loading}
            itemsPerPage={itemsPerPage}
            onDelete={handleDeleteUser}
          />
        </div>
      )}
  
      {/* Edit Role Modal */}
      <Dialog
        open={showConfirmationModal}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
        sx={{ borderRadius: 2 }}
      >
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Role"
            value={selectedUserRole}
            onChange={(e) => setSelectedUserRole(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{ mt: 2 }}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRole} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* Delete Warning Modal */}
      <Dialog open={showDeleteWarningModal} onClose={handleCloseModals}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedUser && selectedUser.firstName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModals} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* User Pets Modal */}
      <UserPetsModal
        showUserPetsModal={showUserPetsModal}
        setShowUserPetsModal={setShowUserPetsModal}
        selectedUser={selectedUser}
      />
    </div>
  );
}  