import React from "react";

import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";
import ResetPassword from "../auth/ResetPassword";

const Default = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Default Page</h1>
      <Logout />
      <RefreshCredentials />
      <ResetPassword />
    </div>
  );
};

export default Default;
