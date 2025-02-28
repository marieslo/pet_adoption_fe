import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import UserPetsModal from './UserPetsModal';
import { SERVER_URL } from '../../api';

const itemsPerPage = 8;

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteWarningModal, setShowDeleteWarningModal] = useState(false);
  const [showUserPetsModal, setShowUserPetsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState('user');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users`);
      const modifiedUsers = response.data.map(user => ({ ...user, id: user._id }));

      // Ensure localeCompare does not throw by safely handling undefined/empty strings
      modifiedUsers.sort((a, b) => {
        const lastNameA = a.lastName || '';
        const lastNameB = b.lastName || '';
        return lastNameA.localeCompare(lastNameB);
      });

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

  return (
    <div className='admin-dashboard-container'>
      <div className="dashboard-header">
        <h2 className='admin-dashboard-name'>Users</h2>
      </div>
      <div className="status-counts">
        <span className='dashboard-counter'>Total Accounts: {users.length}</span>
        <div className="pagination-container">
          Page:
          {loading ? (
            <Spinner animation="grow" variant="light" />
          ) : (
            Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map((_, index) => (
              <Button
                className="pagination-btn"
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                variant={currentPage === index + 1 ? 'light' : 'transparent'}
              >
                {index + 1}
              </Button>
            ))
          )}
        </div>
      </div>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>User's id</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Short Bio</th>
            <th>User's pets</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
            <tr key={user.id}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.shortBio}</td>
              <td>
                <button className='dashboard-icon-viewpets' onClick={() => handleUserPetsClick(user)}>
                </button>
              </td>
              <td>
                <button
                  className='dashboard-icon-edit'
                  onClick={() => handleOpenConfirmationModal(user)}
                >
                </button>
                {user.role || 'user'}
              </td>
              <td>
                <button className='dashboard-icon-delete' onClick={() => handleDeleteUserClick(user)}>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showConfirmationModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="roleSelect">
            <Form.Label>Change Role:</Form.Label>
            <Form.Control as="select" value={selectedUserRole} onChange={(e) => setSelectedUserRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='admin-dashboard-modal-btn' onClick={handleSaveRole}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteWarningModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedUser && selectedUser.firstName}?
        </Modal.Body>
        <Modal.Footer>
          <Button className='admin-dashboard-modal-btn' variant="secondary" onClick={handleCloseModals}>
            Cancel
          </Button>
          <Button className='admin-dashboard-modal-btn' variant="secondary" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <UserPetsModal
        showUserPetsModal={showUserPetsModal}
        setShowUserPetsModal={setShowUserPetsModal}
        selectedUser={selectedUser}
      />
    </div>
  );
}
