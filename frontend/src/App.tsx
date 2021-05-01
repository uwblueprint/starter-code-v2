import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import Default from "./components/pages/Default";
import CreatePage from "./components/pages/CreatePage";
import UpdatePage from "./components/pages/UpdatePage";
import NotFound from "./components/pages/NotFound";
import AuthContext from "./contexts/AuthContext";
import GetPage from "./components/pages/GetPage";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
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
