import React from "react";
import { Route } from "react-router-dom";

import SubRoute from "./sub-route";

const SubRoutes = ({ route }) => {
  return route.routes.map(subRoute => {
    return (
      <Route
        key={subRoute.path}
        exact={subRoute.exact !== undefined ? subRoute.exact : true}
        path={subRoute.path}
      >
        <SubRoute subRoute={subRoute} />
      </Route>
    );
  });
};

SubRoutes.displayName = "SubRoutes";

export default SubRoutes;
