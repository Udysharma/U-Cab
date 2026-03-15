import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ucab_admin');
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem('ucab_admin');
      }
    }
    setLoading(false);
  }, []);

  const adminLoginFn = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('ucab_admin', JSON.stringify(adminData));
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('ucab_admin');
  };

  return (
    <AdminContext.Provider value={{ admin, adminLogin: adminLoginFn, adminLogout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}
