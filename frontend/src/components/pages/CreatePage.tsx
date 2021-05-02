import React from "react";
import { useHistory } from "react-router-dom";
import CreateForm from "../crud/CreateForm";

const MainPageButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/");
  return (
    <div>
      <button className="btn btn-primary" onClick={navigateTo} type="button">
        Go Back
      </button>
    </div>
  );
};

const CreatePage = () => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <CreateForm />
    </div>
  );
};

export default CreatePage;
