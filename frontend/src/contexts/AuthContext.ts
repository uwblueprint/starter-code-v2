import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  setIsAuthenticated: (_isAuthenticated: boolean): void => {},
});

export default AuthContext;
