import { createContext } from "react";

// TODO: move to types
export type AuthenticatedUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "User";
  accessToken: string;
} | null;

type AuthContextType = {
  authenticatedUser: AuthenticatedUser;
  setAuthenticatedUser: (_authenticatedUser: AuthenticatedUser) => void;
};

const AuthContext = createContext<AuthContextType>({
  authenticatedUser: null,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  setAuthenticatedUser: (_authenticatedUser: AuthenticatedUser): void => {},
});

export default AuthContext;
