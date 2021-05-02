import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute = ({ component, exact, path }: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? (
    <Route path={path} exact={exact} component={component} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
