import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  { id: 'admin', label: 'Administrator', description: 'Full system access' },
  { id: 'operator', label: 'Plant Operator', description: 'Can edit production data' },
  { id: 'viewer', label: 'Viewer', description: 'Read-only access' }
];

const PERMISSIONS = [
  { id: 'view', label: 'View Dashboard' },
  { id: 'edit_production', label: 'Edit Production Data' },
  { id: 'edit_equipment', label: 'Edit Equipment' },
  { id: 'edit_water_quality', label: 'Edit Water Quality' },
  { id: 'manage_alerts', label: 'Manage Alerts' },
  { id: 'all', label: 'Full Access (Admin)' }
];

export default function UserManagement() {
  const { users, user: currentUser, addUser, updateUser, deleteUser, addAuditEntry } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'viewer',
    permissions: ['view']
  });
  const [error, setError] = useState('');

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: '',
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions || ['view']
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'viewer',
        permissions: ['view']
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!editingUser && !formData.password) {
      setError('Password is required for new users');
      return;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Valid email is required');
      return;
    }

    const userData = {
      ...formData,
      permissions: formData.role === 'admin' ? ['all'] : formData.permissions
    };

    // Remove password if empty (for editing)
    if (editingUser && !userData.password) {
      delete userData.password;
    }

    let result;
    if (editingUser) {
      result = updateUser(editingUser.id, userData);
    } else {
      result = addUser(userData);
    }

    if (result.success) {
      handleCloseModal();
    } else {
      setError(result.error);
    }
  };

  const handleDelete = (userId) => {
    const result = deleteUser(userId);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      alert(result.error);
    }
  };

  const handleRoleChange = (role) => {
    let permissions = ['view'];
    if (role === 'admin') {
      permissions = ['all'];
    } else if (role === 'operator') {
      permissions = ['view', 'edit_production', 'edit_equipment', 'edit_water_quality'];
    }
    setFormData({ ...formData, role, permissions });
  };

  const togglePermission = (permId) => {
    const newPermissions = formData.permissions.includes(permId)
      ? formData.permissions.filter(p => p !== permId)
      : [...formData.permissions, permId];
    setFormData({ ...formData, permissions: newPermissions });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <p className="text-slate-400 text-sm mt-1">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-400 text-sm">@{user.username}</p>
                      </div>
                      {currentUser?.id === user.id && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium capitalize
                      ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                        user.role === 'operator' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions?.slice(0, 3).map(perm => (
                        <span key={perm} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                          {perm}
                        </span>
                      ))}
                      {user.permissions?.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                          +{user.permissions.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password {editingUser && <span className="text-slate-500">(leave blank to keep)</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={editingUser ? '********' : 'password'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@sarooj.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <div className="space-y-2">
                  {ROLES.map(role => (
                    <label
                      key={role.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                        ${formData.role === role.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-900 border-slate-600 hover:border-slate-500'}
                      `}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={formData.role === role.id}
                        onChange={() => handleRoleChange(role.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${formData.role === role.id ? 'border-blue-500' : 'border-slate-500'}
                      `}>
                        {formData.role === role.id && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{role.label}</p>
                        <p className="text-slate-400 text-sm">{role.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.role !== 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.filter(p => p.id !== 'all').map(perm => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-600 cursor-pointer hover:border-slate-500"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-300 text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete User</h3>
                <p className="text-slate-400 text-sm">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-slate-300 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong> (@{deleteConfirm.username})?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
