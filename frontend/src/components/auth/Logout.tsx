import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const Logout = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout("PLACEHOLDER");
    setIsAuthenticated(!success);
  };

  return (
    <button type="button" className="btn btn-primary" onClick={onLogOutClick}>
      Log Out
    </button>
  );
};

export default Logout;
