// graphql {
import axios from "axios";
import jwt from "jsonwebtoken";
// } graphql
import React from "react";
import ReactDOM from "react-dom";
// graphql {
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "./utils/LocalStorageUtils";
// } graphql

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const REFRESH_MUTATION = `
  mutation {
    refresh
  }
`;

// graphql {
const link = createHttpLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token: string = getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  );

  if (token) {
    const decodedToken: any = jwt.decode(token);

    // refresh if decodedToken has expired
    if (
      decodedToken &&
      decodedToken.exp <= Math.round(new Date().getTime() / 1000)
    ) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/graphql`,
        { query: REFRESH_MUTATION },
        { withCredentials: true },
      );

      const accessToken: string = data.data.refresh;
      setLocalStorageObjProperty(
        AUTHENTICATED_USER_KEY,
        "accessToken",
        accessToken,
      );
      token = accessToken;
    }
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});
// } graphql

ReactDOM.render(
  // graphql {
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  // } graphql

  // rest {
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  // } rest
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
