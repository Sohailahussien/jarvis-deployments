import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../services/mockData';
import { auditService, AUDIT_ACTIONS, AUDIT_ENTITIES } from '../services/auditService';

const AuthContext = createContext(null);

// Demo admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@aquapure.om',
  password: 'admin123',
  user: {
    id: 'admin_001',
    name: 'System Administrator',
    email: 'admin@aquapure.om',
    role: 'admin',
    department: 'IT',
    permissions: ['users', 'production', 'equipment', 'water_quality', 'processes', 'alerts', 'audit']
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user) {
          setUser(parsed.user);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.AUTH);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = {
        user: ADMIN_CREDENTIALS.user,
        token: `token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      setUser(ADMIN_CREDENTIALS.user);

      // Log login action
      auditService.log(
        AUDIT_ACTIONS.LOGIN,
        AUDIT_ENTITIES.SYSTEM,
        ADMIN_CREDENTIALS.user.id,
        { email },
        ADMIN_CREDENTIALS.user.id,
        ADMIN_CREDENTIALS.user.name
      );

      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    if (user) {
      auditService.log(
        AUDIT_ACTIONS.LOGOUT,
        AUDIT_ENTITIES.SYSTEM,
        user.id,
        { email: user.email },
        user.id,
        user.name
      );
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setUser(null);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
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
