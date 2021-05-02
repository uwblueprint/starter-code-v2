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
import { getLocalStorageObjProperty } from "./utils/LocalStorageUtils";
// } graphql

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// graphql {
const link = createHttpLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getLocalStorageObjProperty(
    AUTHENTICATED_USER_KEY,
    "accessToken",
  );
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
