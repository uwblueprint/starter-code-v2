import React, { useContext } from "react";
// graphql {
import { gql, useMutation } from "@apollo/client";
// } graphql
// rest {
import authAPIClient from "../../APIClients/AuthAPIClient";
// } rest
import AuthContext from "../../contexts/AuthContext";
// graphql {
import AUTHENTICATED_USER_KEY from "../../constants/AuthConstants";
import { setLocalStorageObjProperty } from "../../utils/LocalStorageUtils";

const REFRESH = gql`
  mutation Refresh {
    refresh
  }
`;
// } graphql

const RefreshCredentials = () => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  // graphql {
  const [refresh] = useMutation<{ refresh: string }>(REFRESH);

  // } graphql
  const onRefreshClick = async () => {
    // graphql {
    const result = await refresh();
    let success: boolean = false;
    const token = result.data?.refresh;
    if (token) {
      success = true;
      setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "accessToken", token);
    }
    // } graphql
    // rest {
    const success = await authAPIClient.refresh();
    // } rest
    if (!success) {
      setAuthenticatedUser(null);
    }
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onRefreshClick}>
      Refresh Credentials
    </button>
  );
};

export default RefreshCredentials;
