// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";

import AppRoute from "./app-route";

function ApplicationRoutes({ routes }) {
  const appRoutes = routes.map((route, index) => {
    const { routes: subRoutes, exact, path } = route;

    const routeProps = {
      path: subRoutes ? subRoutes.map(r => r.path) : path,
      exact: subRoutes ? routes.some(r => r.exact) : exact
    };

    return (
      <Route key={path || index} {...routeProps}>
        <AppRoute route={route} />
      </Route>
    );
  });

  return <Switch>{appRoutes}</Switch>;
}

ApplicationRoutes.displayName = "ApplicationRoutes";

ApplicationRoutes.propTypes = {
  routes: PropTypes.array.isRequired
};

export default ApplicationRoutes;
