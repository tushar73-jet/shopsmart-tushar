import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getUsers, createUser, updateUser, deleteUser } from '../services/users';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Users = () => {
  const { data: users, loading, error, refetch } = useFetch(getUsers);
  const { showToast } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({ name: user.name || '', email: user.email });
    } else {
      setCurrentUser(null);
      setFormData({ name: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await updateUser(currentUser.id, formData);
        showToast('User updated successfully');
      } else {
        await createUser(formData);
        showToast('User created successfully');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save user', 'error');
    }
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(currentUser.id);
      showToast('User deleted successfully');
      setIsConfirmOpen(false);
      refetch();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add User</button>
      </div>

      <ErrorMessage message={error} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name || '-'}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={() => handleOpenModal(user)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(user)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentUser ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${currentUser?.email}?`}
      />
    </div>
  );
};

export default Users;
