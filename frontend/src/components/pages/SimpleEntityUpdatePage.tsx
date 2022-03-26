import React from "react";
import SimpleEntityUpdateForm from "../crud/SimpleEntityUpdateForm";
import MainPageButton from "../common/MainPageButton";

const SimpleEntityUpdatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <SimpleEntityUpdateForm />
    </div>
  );
};

export default SimpleEntityUpdatePage;
