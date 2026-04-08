import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("car360-auth");
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });

  useEffect(() => {
    localStorage.setItem("car360-auth", JSON.stringify(auth));
  }, [auth]);

  const login = async (payload) => {
    const response = await loginUser(payload);
    setAuth(response);
    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    setAuth(response);
    return response;
  };

  const logout = () => {
    setAuth({ user: null, token: null });
  };

  const refreshProfile = async () => {
    if (!auth.token) return null;
    const profile = await getProfile(auth.token);
    setAuth((current) => ({ ...current, user: profile }));
    return profile;
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

