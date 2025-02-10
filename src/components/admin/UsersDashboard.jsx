import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserPetsModal from './UserPetsModal';
import { SERVER_URL } from '../../api';
import LoadingSpinner from '../LoadingSpinner';

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
      modifiedUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));
      setUsers(modifiedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserPetsClick = (user) => {
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
    <div className='p-4'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-2xl font-semibold'>Users</h2>
        <div className="flex items-center">
          <span className='mr-4'>Total Accounts: {users.length}</span>
          <div className="flex space-x-2">
            {loading ? (
              <LoadingSpinner />
            ) : (
              Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  className={`p-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <table className="min-w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Last Name</th>
            <th className="p-2 text-left">First Name</th>
            <th className="p-2 text-left">User ID</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">Bio</th>
            <th className="p-2 text-center">User's Pets</th>
            <th className="p-2 text-center">Change Role</th>
            <th className="p-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.lastName}</td>
              <td className="p-2">{user.firstName}</td>
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phoneNumber}</td>
              <td className="p-2">{user.shortBio}</td>
              <td className="p-2 text-center">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleUserPetsClick(user)}
                >
                  View Pets
                </button>
              </td>
              <td className="p-2 text-center">
                <button
                  className="bg-yellow-500 text-white p-2 rounded"
                  onClick={() => handleOpenConfirmationModal(user)}
                >
                  Edit Role
                </button>
                {user.role || 'user'}
              </td>
              <td className="p-2 text-center">
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleDeleteUserClick(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Role</h2>
            <label htmlFor="role">Change Role</label>
            <select
              id="role"
              value={selectedUserRole}
              onChange={(e) => setSelectedUserRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button className="bg-blue-500 text-white p-2 rounded mt-4" onClick={handleSaveRole}>
              Save
            </button>
            <button className="bg-gray-500 text-white p-2 rounded mt-4" onClick={handleCloseModals}>
              Close
            </button>
          </div>
        </div>
      )}
      {showDeleteWarningModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete User</h2>
            <p>Are you sure you want to delete {selectedUser && selectedUser.firstName}?</p>
            <button className="bg-gray-500 text-white p-2 rounded" onClick={handleCloseModals}>
              Cancel
            </button>
            <button className="bg-red-500 text-white p-2 rounded" onClick={handleDeleteUser}>
              Delete
            </button>
          </div>
        </div>
      )}
      <UserPetsModal
        showUserPetsModal={showUserPetsModal}
        setShowUserPetsModal={setShowUserPetsModal}
        selectedUser={selectedUser}
      />
    </div>
  );
}