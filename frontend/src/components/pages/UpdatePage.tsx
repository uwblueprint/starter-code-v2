import React from "react";
import { useHistory } from "react-router-dom";
import UpdateForm from "../crud/UpdateForm";

const MainPageButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/");
  return (
    <div>
      <button onClick={navigateTo} className="btn btn-primary" type="button">
        Go Back
      </button>
    </div>
  );
};

const UpdatePage = () => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <UpdateForm />
    </div>
  );
};

export default UpdatePage;
