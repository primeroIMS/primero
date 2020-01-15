import React from "react";
import PropTypes from "prop-types";

import { PERMITTED_URL } from "../../config";
import Permission from "../application/permission";

const SubRoute = ({ subRoute }) => {
  const {
    path,
    resources,
    actions,
    component: Component,
    extraProps
  } = subRoute;

  return PERMITTED_URL.includes(path) ? (
    <Component {...extraProps} />
  ) : (
    <Permission resources={resources} actions={actions} redirect>
      <Component {...extraProps} />
    </Permission>
  );
};

SubRoute.displayName = "SubRoute";

SubRoute.propTypes = {
  subRoute: PropTypes.object.isRequired
};

export default SubRoute;
