import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import Default from "./components/pages/Default";
import NotFound from "./components/pages/NotFound";
import AuthContext from "./contexts/AuthContext";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Default} />
          <Route exact path="/login" component={Login} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
