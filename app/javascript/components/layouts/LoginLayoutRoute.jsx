import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import LoginLayout from "./LoginLayout";

const LoginLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <LoginLayout>
          <Component {...matchProps} />
        </LoginLayout>
      )}
    />
  );
};

LoginLayoutRoute.propTypes = {
  component: PropTypes.node
};

export default LoginLayoutRoute;
