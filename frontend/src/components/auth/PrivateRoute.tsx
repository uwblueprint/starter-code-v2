import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";
import { LOGIN_PAGE } from "../../constants/Routes";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
  exact: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component,
  exact,
  path,
}: PrivateRouteProps) => {
  const { authenticatedUser } = useContext(AuthContext);

  return authenticatedUser ? (
    <Route path={path} Component={component}/>
  ) : (
    <Navigate to={LOGIN_PAGE} />
  );
};

export default PrivateRoute;
