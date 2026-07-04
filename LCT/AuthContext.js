
Action: file_editor create /app/frontend/src/context/AuthContext.js --file-text "import React, { createContext, useContext, useState, useEffect } from \"react\";
import axios from \"axios\";

// Enable credentials for cookies globally
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = loading, false = not authenticated, object = authenticated
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      const { data } = await axios.get(`${backendUrl}/api/auth/me`);
      setUser(data);
    } catch (e) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
    const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
    const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || \"\";
      await axios.post(`${backendUrl}/api/auth/logout`);
    } catch (e) {
      console.error(\"Logout error\", e);
    } finally {
      setUser(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
"
