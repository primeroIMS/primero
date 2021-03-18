import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import { PERMITTED_URL, ROUTES } from "../../config";
import { useMemoizedSelector } from "../../libs";
import Permission from "../application/permission";
import { getCodeOfConductEnabled } from "../application/selectors";
import { getCodeOfConductId } from "../user";

const SubRoute = ({ subRoute }) => {
  const { path, resources, actions, component: Component, extraProps } = subRoute;

  const codeOfConductAccepted = useMemoizedSelector(state => getCodeOfConductId(state));
  const codeOfConductEnabled = useMemoizedSelector(state => getCodeOfConductEnabled(state));

  if (codeOfConductEnabled && !codeOfConductAccepted && ![ROUTES.logout, ROUTES.login].includes(path)) {
    return <Redirect to={{ pathname: ROUTES.code_of_conduct, state: { referrer: path } }} />;
  }

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
