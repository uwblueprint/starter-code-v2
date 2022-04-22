import React, { useContext } from "react";
// graphql {
import { gql, useMutation } from "@apollo/client";
// } graphql

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

// graphql {
const REFRESH = gql`
  mutation Refresh {
    refresh
  }
`;
// } graphql

const RefreshCredentials = (): React.ReactElement => {
  const { setAuthenticatedUser } = useContext(AuthContext);

  // graphql {
  const [refresh] = useMutation<{ refresh: string }>(REFRESH);

  // } graphql
  const onRefreshClick = async () => {
    // graphql {
    const success = await authAPIClient.refresh(refresh);
    // } graphql
    /* } rest
    const success = await authAPIClient.refresh();
    } rest */
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
