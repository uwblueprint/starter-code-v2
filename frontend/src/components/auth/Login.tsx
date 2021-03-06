import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
// graphql {
import { gql, useMutation } from "@apollo/client";
// } graphql

import authAPIClient from "../../APIClients/AuthAPIClient";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

// graphql {
const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

const Login = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // graphql {
  const [login] = useMutation<{ login: AuthenticatedUser }>(LOGIN);
  // } graphql

  const onLogInClick = async () => {
    // graphql {
    const user: AuthenticatedUser = await authAPIClient.login(
      email,
      password,
      login,
    );
    // } graphql
    // rest {
    // const user: AuthenticatedUser = await authAPIClient.login(email, password);
    // } rest
    setAuthenticatedUser(user);
  };

  if (authenticatedUser) {
    return <Redirect to="/" />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form>
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
            onClick={onLogInClick}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
