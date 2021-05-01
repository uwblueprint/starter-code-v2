import React from "react";
import { useHistory } from "react-router-dom";

const MainPageButton = () => {
  const history = useHistory();
  const navigateTo = () => history.push("/");
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

export default MainPageButton;
