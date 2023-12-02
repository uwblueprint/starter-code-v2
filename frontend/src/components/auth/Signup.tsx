import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
// graphql {
import { gql, useMutation } from "@apollo/client";
// } graphql

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

// graphql {
const REGISTER = gql`
  mutation Signup_Register(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    register(
      user: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
      }
    ) {
      id
      firstName
      lastName
      email
      role
      accessToken
    }
  }
`;
// } graphql

const Signup = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // graphql {
  const [register] = useMutation<{ register: AuthenticatedUser }>(REGISTER);
  // } graphql

  const onSignupClick = async () => {
    // graphql {
    const user: AuthenticatedUser = await authAPIClient.register(
      firstName,
      lastName,
      email,
      password,
      register,
    );
    // } graphql
    // rest {
    // const user: AuthenticatedUser = await authAPIClient.register(
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    // );
    // } rest
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Navigate to={HOME_PAGE} />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Signup</h1>
      <form>
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="first name"
          />
        </div>
        <div>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="last name"
          />
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="username@domain.com"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onSignupClick}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
