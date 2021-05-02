import "bootstrap/dist/css/bootstrap.min.css";
// auth {
import React, { useState } from "react";
// } auth
// no-auth {
import React from "react";
// } no-auth
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// auth {
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
// } auth
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
// auth {
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext, { AuthenticatedUser } from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
// } auth

const App = () => {
  // auth {
  const currentUser: AuthenticatedUser = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  // } auth
  return (
    // auth {
    <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
    // } auth
      <Router>
        <Switch>
          // auth {
          <PrivateRoute exact path="/" component={Default} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/entity/create" component={CreatePage} />
          <PrivateRoute exact path="/entity/update" component={UpdatePage} />
          <PrivateRoute exact path="/entity" component={DisplayPage} />
          // } auth
          // no-auth {
          <Route exact path="/" component={Default} />
          <Route exact path="/entity/create" component={CreatePage} />
          <Route exact path="/entity/update" component={UpdatePage} />
          <Route exact path="/entity" component={DisplayPage} />
          // } no-auth
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    // auth {
    </AuthContext.Provider>
    // } auth
  );
};

export default App;
