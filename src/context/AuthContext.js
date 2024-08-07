import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
import bcrypt from 'bcryptjs'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const userRef = ref(db, 'users/' + userId);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setCurrentUser(userData);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (webId, password) => {
    const userRef = ref(db, 'users/' + webId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      
      const isMatch = await bcrypt.compare(password, userData.password);
      if (isMatch) {
        setCurrentUser(userData);
        localStorage.setItem('userId', webId); 
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
