import React, { useContext } from "react";
// graphql {
import { gql, useMutation } from "@apollo/client";
// } graphql

// rest {
// import authAPIClient from "../../APIClients/AuthAPIClient";
// } rest
import AuthContext from "../../contexts/AuthContext";
// graphql {
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";

const LOGOUT = gql`
  mutation Logout($userId: ID!) {
    logout(userId: $userId)
  }
`;
// } graphql

const Logout = () => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  // graphql {
  const [logout] = useMutation<{ logout: null }>(LOGOUT);
  // } graphql

  const onLogOutClick = async () => {
    // graphql {
    const result = await logout({
      variables: { userId: String(authenticatedUser?.id) },
    });
    let success: boolean = false;
    if (result.data?.logout === null) {
      success = true;
      localStorage.removeItem(AUTHENTICATED_USER_KEY);
    }
    // } graphql
    // rest {
    // const success = await authAPIClient.logout(authenticatedUser?.id);
    // } rest
    if (success) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onLogOutClick}>
      Log Out
    </button>
  );
};

export default Logout;