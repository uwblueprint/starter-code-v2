import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import SampleContext from "../../contexts/SampleContext";

import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";
import ResetPassword from "../auth/ResetPassword";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const history = useHistory();
  const navigateTo = () => history.push(`/${path}`);
  return (
    <button className="btn btn-primary" onClick={navigateTo} type="button">
      {text}
    </button>
  );
};

const TeamInfoDisplay = () => {
  const { teamName, numTerms, members, isActive } = useContext(SampleContext);
  return (
    <div>
      <h2>Team Info</h2>
      <div>Name: {teamName}</div>
      <div># terms: {numTerms}</div>
      <div>
        Members:{" "}
        {members.map(
          (name, i) => ` ${name}${i === members.length - 1 ? "" : ","}`,
        )}
      </div>
      <div>Active: {isActive ? "Yes" : "No"}</div>
    </div>
  );
};

const Default = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Default Page</h1>
      <div className="btn-group" style={{ paddingRight: "10px" }}>
        <Logout />
        <RefreshCredentials />
        <ResetPassword />
        <Button text="Create Entity" path="entity/create" />
        <Button text="Update Entity" path="entity/update" />
        <Button text="Display Entities" path="entity" />
        <Button text="Edit Team" path="edit-team" />
      </div>

      <div style={{ height: "2rem" }} />

      <TeamInfoDisplay />
    </div>
  );
};

export default Default;
