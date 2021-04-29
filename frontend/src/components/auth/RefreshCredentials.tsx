import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const RefreshCredentials = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const onRefreshClick = async () => {
    const success = await authAPIClient.refresh();
    setIsAuthenticated(success);
  };

  return (
    <button type="button" onClick={onRefreshClick}>
      Refresh Credentials
    </button>
  );
};

export default RefreshCredentials;
