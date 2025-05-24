/* eslint-disable */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAPI from "../../back/api/users";

// Create a context for authentication
const AuthContext = createContext(null);

// Provider for authentication
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialisation basée sur le token dans localStorage
    return !!localStorage.getItem('authToken');
  });

  // Ajax request to recover user informations
  const fetchUserInfo = async () => {
    try {
      const data = await UserAPI.GetUserInfo(user);
      setUser(data.user);
      setRoles(data.user.roles);
    } catch (err) {
      console.log(err);
    }
  };

  // Check if token is already exist (Refreshing)
  useEffect(() => {
    // Checks if a token is stored in localStorage at startup
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      fetchUserInfo();
    }
  }, []);


  // Login function to set user and roles, and store token in localStorage
  const login = async (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    fetchUserInfo();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken'); // Remove the token during logout
    navigate('/');
  };


  return (
    <AuthContext.Provider value={{ user, roles, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the Auth context
export const useAuth = () => useContext(AuthContext);