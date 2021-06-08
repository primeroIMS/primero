import PropTypes from "prop-types";

import Layouts from "../layouts";

import SubRoutes from "./sub-routes";

const AppRoute = ({ route }) => {
  const { layout, component: Component, extraProps, ...routeProps } = route;

  if (layout) {
    return (
      <Layouts layout={layout}>
        <SubRoutes route={route} />
      </Layouts>
    );
  }

  return <Component {...routeProps} {...extraProps} />;
};

AppRoute.displayName = "AppRoute";

AppRoute.propTypes = {
  route: PropTypes.object.isRequired
};

export default AppRoute;
