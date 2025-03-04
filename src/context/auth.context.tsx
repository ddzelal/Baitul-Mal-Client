import { createContext, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applicationRoutes } from "@/constants/navigation-links.tsx";
import {
  getAuth,
  removeAuth,
  setAuth as setAuthInStorage,
} from "@/lib/auth.utils";
import {
  AuthContextType,
  AuthProviderProps,
  IAuth,
} from "@/interfaces/auth.interface.ts";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  update: () => {},
});

const AuthProvider = ({
  children,
  userData: initialUserData,
}: AuthProviderProps) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<IAuth | null>(() => {
    if (initialUserData) {
      return initialUserData;
    }

    const storedUser = getAuth();
    return storedUser || null;
  });

  console.log(user, "USER FROM CONTEXT");

  const login = useCallback(
    (userData: IAuth) => {
      setAuthInStorage(userData);
      setUser(userData);
      navigate(applicationRoutes.dashboard.link);
    },
    [navigate]
  );

  const logout = useCallback(() => {
    removeAuth();
    setUser(null);
    navigate(applicationRoutes.login.link);
  }, [navigate]);

  const update = useCallback((userData: IAuth) => {
    setAuthInStorage(userData);
    setUser(userData);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      update,
    }),
    [login, logout, update, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthProvider;
