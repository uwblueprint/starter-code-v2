// graphql {
// auth {
import axios from "axios";
import jwt from "jsonwebtoken";
// } auth
// } graphql
import React from "react";
import ReactDOM from "react-dom";
// graphql {
// no-file-storage {
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
// } no-file-storage
// file-storage {
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
// } file-storage
// auth {
import { setContext } from "@apollo/client/link/context";

import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import { AuthenticatedUser, DecodedJWT } from "./types/AuthTypes";
import {
  getLocalStorageObjProperty,
  setLocalStorageObjProperty,
} from "./utils/LocalStorageUtils";
// } auth
// } graphql

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// graphql {
// auth {
const REFRESH_MUTATION = `
  mutation Index_Refresh {
    refresh
  }
`;

// } auth
// no-file-storage {
const link = createHttpLink({
// } no-file-storage
// file-storage {
const link = createUploadLink({
// } file-storage
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "include",
});

// auth {
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token: string | null = getLocalStorageObjProperty<
    NonNullable<AuthenticatedUser>,
    string
  >(AUTHENTICATED_USER_KEY, "accessToken");

  if (token) {
    const decodedToken = jwt.decode(token) as DecodedJWT;

    // refresh if decodedToken has expired
    if (
      decodedToken &&
      (typeof decodedToken === "string" ||
        decodedToken.exp <= Math.round(new Date().getTime() / 1000))
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

// } auth
const apolloClient = new ApolloClient({
  // auth {
  // no-file-storage {
  link: authLink.concat(link),
  // } no-file-storage
  // file-storage {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  link: authLink.concat(link as any),
  // } file-storage
  // } auth
  // no-auth {
  // no-file-storage {
  link,
  // } no-file-storage
  // file-storage {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  link: (link as any),
  // } file-storage
  // } no-auth
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
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // } rest
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
