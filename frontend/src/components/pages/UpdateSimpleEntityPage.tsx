import React from "react";
import UpdateSimpleEntityForm from "../crud/UpdateSimpleEntityForm";
import MainPageButton from "../common/MainPageButton";

const UpdateSimpleEntityPage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <UpdateSimpleEntityForm />
    </div>
  );
};

export default UpdateSimpleEntityPage;
