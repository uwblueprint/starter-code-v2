import React from "react";
import DisplaySimpleEntitiesTableContainer from "../crud/DisplaySimpleEntitiesTableContainer";
import MainPageButton from "../common/MainPageButton";

const GetSimpleEntitiesPage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
      <DisplaySimpleEntitiesTableContainer />
    </div>
  );
};

export default GetSimpleEntitiesPage;
