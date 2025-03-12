import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users`);
      const modifiedUsers = response.data.map(user => ({ ...user, id: user._id }));
      modifiedUsers.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
      setUsers(modifiedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${SERVER_URL}/users/${selectedUser.id}`);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setShowDeleteWarningModal(false);
    }
  };

  const handleSaveRole = async () => {
    try {
      await axios.put(`${SERVER_URL}/users/profile/${selectedUser.id}`, { role: selectedUserRole });
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: selectedUserRole } : user)));
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const columns = [
    { label: 'Last Name', key: 'lastName' },
    { label: 'First Name', key: 'firstName' },
    { label: `User's id`, key: 'id' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Short Bio', key: 'shortBio' },
    {
      label: `User's pets`,
      key: 'pets',
      render: (user) => (
        <button className='dashboard-icon-viewpets' onClick={() => setShowUserPetsModal(true)}></button>
      ),
    },
    {
      label: 'Change Role',
      key: 'role',
      render: (user) => (
        <>
          <button className='dashboard-icon-edit' onClick={() => setSelectedUser(user) || setShowConfirmationModal(true)}></button>
          {user.role || 'user'}
        </>
      ),
    },
    {
      label: 'Delete',
      key: 'delete',
      render: (user) => (
        <button className='dashboard-icon-delete' onClick={() => setSelectedUser(user) || setShowDeleteWarningModal(true)}></button>
      ),
    },
  ];

  return (
    <div className='admin-dashboard-container'>
      <h2 className='admin-dashboard-name'>Users</h2>
      <span className='dashboard-counter'>Total Accounts: {users.length}</span>
      {loading ? (
          <Spinner animation='grow' variant='light' />
        ) : users && users.length > 0 ? (
          <AdminTable
            data={users}
            columns={columns}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <p>No users found.</p>
        )}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId='roleSelect'>
            <Form.Label>Change Role:</Form.Label>
            <Form.Control as='select' value={selectedUserRole} onChange={(e) => setSelectedUserRole(e.target.value)}>
              <option value='user'>user</option>
              <option value='admin'>admin</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' className='admin-dashboard-modal-btn' onClick={handleSaveRole}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteWarningModal} onHide={() => setShowDeleteWarningModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedUser && selectedUser.firstName}?
        </Modal.Body>
        <Modal.Footer>
          <Button className='admin-dashboard-modal-btn' variant='secondary' onClick={() => setShowDeleteWarningModal(false)}>Cancel</Button>
          <Button className='admin-dashboard-modal-btn' variant='secondary' onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <UserPetsModal showUserPetsModal={showUserPetsModal} setShowUserPetsModal={setShowUserPetsModal} selectedUser={selectedUser} />
    </div>
  );
}