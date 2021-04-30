import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import Default from "./components/pages/Default";
import CreatePage from "./components/pages/CreatePage";
import UpdatePage from "./components/pages/UpdatePage";
import NotFound from "./components/pages/NotFound";
import GetPage from "./components/pages/GetPage";
import "bootstrap/dist/css/bootstrap.min.css";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext, { AuthenticatedUser } from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

const App = () => {
  const currentUser: AuthenticatedUser = getLocalStorageObj(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  return (
    <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Default} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/entity/create" component={CreatePage} />
          <PrivateRoute exact path="/entity/update" component={UpdatePage} />
          <PrivateRoute exact path="/entity/get" component={GetPage} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
