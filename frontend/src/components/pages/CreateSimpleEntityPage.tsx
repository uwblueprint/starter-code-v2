import React from "react";
import CreateSimpleEntityForm from "../crud/CreateSimpleEntityForm";
import MainPageButton from "../common/MainPageButton";

const CreateSimpleEntityPage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <CreateSimpleEntityForm />
    </div>
  );
};

export default CreateSimpleEntityPage;
