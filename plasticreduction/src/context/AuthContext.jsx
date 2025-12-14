import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Default users (in production, this would come from a backend)
const DEFAULT_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    email: 'admin@sarooj.com',
    permissions: ['all']
  },
  {
    id: '2',
    username: 'operator',
    password: 'operator123',
    name: 'Plant Operator',
    role: 'operator',
    email: 'operator@sarooj.com',
    permissions: ['view', 'edit_production', 'edit_equipment', 'edit_water_quality']
  },
  {
    id: '3',
    username: 'viewer',
    password: 'viewer123',
    name: 'Dashboard Viewer',
    role: 'viewer',
    email: 'viewer@sarooj.com',
    permissions: ['view']
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    // Load saved session and data
    try {
      const savedUsers = localStorage.getItem('sarooj_users');
      const savedAuditLog = localStorage.getItem('sarooj_audit_log');
      const savedUser = localStorage.getItem('sarooj_user');

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers);
        } else {
          setUsers(DEFAULT_USERS);
          localStorage.setItem('sarooj_users', JSON.stringify(DEFAULT_USERS));
        }
      } else {
        setUsers(DEFAULT_USERS);
        localStorage.setItem('sarooj_users', JSON.stringify(DEFAULT_USERS));
      }

      if (savedAuditLog) {
        const parsedLog = JSON.parse(savedAuditLog);
        if (Array.isArray(parsedLog)) {
          setAuditLog(parsedLog);
        }
      }

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id && parsedUser.username) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('sarooj_user');
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      // Reset to defaults on error
      localStorage.removeItem('sarooj_user');
      localStorage.removeItem('sarooj_users');
      localStorage.removeItem('sarooj_audit_log');
      setUsers(DEFAULT_USERS);
      localStorage.setItem('sarooj_users', JSON.stringify(DEFAULT_USERS));
    }

    setIsLoading(false);
  }, []);

  const addAuditEntry = (action, details, targetUser = null) => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      userId: user?.id || 'system',
      userName: user?.name || 'System',
      action,
      details,
      targetUser,
      ipAddress: 'localhost'
    };

    const newLog = [entry, ...auditLog].slice(0, 1000); // Keep last 1000 entries
    setAuditLog(newLog);
    localStorage.setItem('sarooj_audit_log', JSON.stringify(newLog));
    return entry;
  };

  const login = (username, password) => {
    const foundUser = users.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('sarooj_user', JSON.stringify(userWithoutPassword));

      // Add audit entry after setting user
      const entry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: foundUser.id,
        userName: foundUser.name,
        action: 'LOGIN',
        details: `User ${foundUser.username} logged in`,
        targetUser: null,
        ipAddress: 'localhost'
      };
      const newLog = [entry, ...auditLog].slice(0, 1000);
      setAuditLog(newLog);
      localStorage.setItem('sarooj_audit_log', JSON.stringify(newLog));

      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    if (user) {
      addAuditEntry('LOGOUT', `User ${user.username} logged out`);
    }
    setUser(null);
    localStorage.removeItem('sarooj_user');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin' || user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const addUser = (newUser) => {
    if (users.find(u => u.username === newUser.username)) {
      return { success: false, error: 'Username already exists' };
    }

    const userToAdd = {
      ...newUser,
      id: Date.now().toString()
    };

    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    localStorage.setItem('sarooj_users', JSON.stringify(updatedUsers));
    addAuditEntry('USER_CREATED', `Created user: ${newUser.username}`, newUser.username);
    return { success: true, user: userToAdd };
  };

  const updateUser = (userId, updates) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    // Check username uniqueness if changing username
    if (updates.username && updates.username !== users[userIndex].username) {
      if (users.find(u => u.username === updates.username)) {
        return { success: false, error: 'Username already exists' };
      }
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updates };
    setUsers(updatedUsers);
    localStorage.setItem('sarooj_users', JSON.stringify(updatedUsers));
    addAuditEntry('USER_UPDATED', `Updated user: ${updatedUsers[userIndex].username}`, updatedUsers[userIndex].username);

    // Update current session if editing own profile
    if (user && user.id === userId) {
      const { password: _, ...userWithoutPassword } = updatedUsers[userIndex];
      setUser(userWithoutPassword);
      localStorage.setItem('sarooj_user', JSON.stringify(userWithoutPassword));
    }

    return { success: true, user: updatedUsers[userIndex] };
  };

  const deleteUser = (userId) => {
    if (user && user.id === userId) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
      return { success: false, error: 'User not found' };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('sarooj_users', JSON.stringify(updatedUsers));
    addAuditEntry('USER_DELETED', `Deleted user: ${userToDelete.username}`, userToDelete.username);
    return { success: true };
  };

  const value = {
    user,
    users,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    addUser,
    updateUser,
    deleteUser,
    auditLog,
    addAuditEntry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
