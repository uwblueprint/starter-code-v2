import "bootstrap/dist/css/bootstrap.min.css";
// auth {
import React, { useState, useReducer } from "react";
// } auth
// no-auth {
import React, { useReducer } from "react";
// } no-auth
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// auth {
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
// } auth
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import DisplayPage from "./components/pages/DisplayPage";
import NotFound from "./components/pages/NotFound";
import UpdatePage from "./components/pages/UpdatePage";
import * as Routes from "./constants/Routes";
// auth {
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
// } auth
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";

// auth {
import { AuthenticatedUser } from "./types/AuthTypes";

// } auth
const App = (): React.ReactElement => {
  // auth {
  const currentUser: AuthenticatedUser = getLocalStorageObj<AuthenticatedUser>(
    AUTHENTICATED_USER_KEY,
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>(
    currentUser,
  );

  // } auth
  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  return (
    // auth {
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
              <PrivateRoute
                exact
                path={Routes.HOOKS_PAGE}
                component={HooksDemo}
              />
              <Route exact path="*" component={NotFound} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
    // } auth
    // no-auth {
    <SampleContext.Provider value={sampleContext}>
      <SampleContextDispatcherContext.Provider
        value={dispatchSampleContextUpdate}
      >
        <Router>
          <Switch>
            <Route exact path={Routes.HOME_PAGE} component={Default} />
            <Route exact path={Routes.CREATE_ENTITY_PAGE} component={CreatePage} />
            <Route exact path={Routes.UPDATE_ENTITY_PAGE} component={UpdatePage} />
            <Route exact path={Routes.DISPLAY_ENTITY_PAGE} component={DisplayPage} />
            <Route exact path={Routes.EDIT_TEAM_PAGE} component={EditTeamInfoPage} />
            <Route exact path={Routes.HOOKS_PAGE} component={HooksDemo} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
    // } no-auth
  );
};

export default App;
