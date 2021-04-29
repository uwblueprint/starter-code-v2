import React, { useContext } from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";

const Logout = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout("6089f0e3df238eb0662e3ceb");
    setIsAuthenticated(!success);
  };

  return (
    <button type="button" onClick={onLogOutClick}>
      Log Out
    </button>
  );
};

export default Logout;
