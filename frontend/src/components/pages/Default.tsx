import React from "react";
import { useHistory } from "react-router-dom";
import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";
import ResetPassword from "../auth/ResetPassword";

const CreateButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/entity/create");

  return (
    <div>
      <button onClick={navigateTo} type="button">
        Create Entity
      </button>
    </div>
  );
};

const UpdateButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/entity/update");

  return (
    <div>
      <button onClick={navigateTo} type="button">
        Update Entity
      </button>
    </div>
  );
};

const Default = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Default Page</h1>
      <Logout />
      <RefreshCredentials />
      <ResetPassword />
      <CreateButton />
      <UpdateButton />
    </div>
  );
};

export default Default;
