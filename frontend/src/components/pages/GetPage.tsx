import React from "react";
import { useHistory } from "react-router-dom";
import TableWrapper from "../crud/TableWrapper";

const MainPageButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("../");
  return (
    <div>
      <button
        onClick={navigateTo}
        className="btn btn-primary"
        type="button"
        style={{ textAlign: "center" }}
      >
        Go Back
      </button>
    </div>
  );
};

const GetPage = () => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <TableWrapper />
    </div>
  );
};

export default GetPage;
