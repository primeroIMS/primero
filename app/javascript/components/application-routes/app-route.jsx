import React from "react";
import PropTypes from "prop-types";

import SubRoutes from "./sub-routes";

const AppRoute = ({ route }) => {
  const { layout: Layout, component: Component, ...routeProps } = route;

  if (Layout) {
    return (
      <Layout>
        <SubRoutes route={route} />
      </Layout>
    );
  }

  return <Component {...routeProps} />;
};

AppRoute.displayName = "AppRoute";

AppRoute.propTypes = {
  route: PropTypes.object.isRequired
};

export default AppRoute;
