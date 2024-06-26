import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";

import { AuthenticatedUser } from "./types/AuthTypes";
import authAPIClient from "./APIClients/AuthAPIClient";
import * as Routes from "./constants/Routes";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>(currentUser);

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  const REFRESH = gql`
    mutation Refresh {
      refresh
    }
  `;

  const HOUR_MS = 3300000;
  const doRefresh = useMutation(REFRESH);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUser != null) {
        const [refresh] = doRefresh;
        const success = await authAPIClient.refresh(refresh);
        if (!success) {
          setAuthenticatedUser(null);
        }
      }
    }, HOUR_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [currentUser, doRefresh]);

  return (
    <SampleContext.Provider value={sampleContext}>
      <SampleContextDispatcherContext.Provider
        value={dispatchSampleContextUpdate}
      >
        <AuthContext.Provider
          value={{ authenticatedUser, setAuthenticatedUser }}
        >
          <Router>
            <Switch>
              <Route exact path={Routes.LOGIN_PAGE} component={Login} />
              <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
              <Route exact path={Routes.HOOKS_PAGE} component={HooksDemo} />
              <PrivateRoute exact path={Routes.HOME_PAGE} component={Default} />
              <PrivateRoute
                exact
                path={Routes.CREATE_ENTITY_PAGE}
                component={CreatePage}
              />
              <PrivateRoute
                exact
                path={Routes.UPDATE_ENTITY_PAGE}
                component={UpdatePage}
              />
              <PrivateRoute
                exact
                path={Routes.DISPLAY_ENTITY_PAGE}
                component={DisplayPage}
              />
              <PrivateRoute
                exact
                path={Routes.EDIT_TEAM_PAGE}
                component={EditTeamInfoPage}
              />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
  );
};

export default App;
