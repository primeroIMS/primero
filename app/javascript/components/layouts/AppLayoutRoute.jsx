import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import AppLayout from "./AppLayout";

const AppLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (
        <AppLayout>
          <Component {...rest} />
        </AppLayout>
      )}
    />
  );
};

AppLayoutRoute.propTypes = {
  component: PropTypes.node
};

export default AppLayoutRoute;
