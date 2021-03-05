import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Map } from "immutable";
import { isEqual } from "lodash";

import { getPermissions } from "../user/selectors";
import { RESOURCES } from "../../libs/permissions";
import { INCIDENT_FROM_CASE, MODES } from "../../config";

const Permission = ({ resources, actions, redirect, children, match }) => {
  const { params } = match;
  const { recordType } = params;
  const type = resources || recordType;
  const dispatch = useDispatch();
  const allUserPermissions = useSelector(state => getPermissions(state), isEqual);

  const filteredPermissions = allUserPermissions.entrySeq().reduce((acum, [key, value]) => {
    if ((Array.isArray(type) && type.includes(key)) || type === key) {
      return acum.set(key, value);
    }

    return acum;
  }, Map({}));

  const hasIncidentFromCase =
    type === RESOURCES.incidents &&
    children?.props?.mode === MODES.new &&
    allUserPermissions
      .entrySeq()
      .some(([key, value]) => key === RESOURCES.cases && value.some(permission => permission === INCIDENT_FROM_CASE));

  const verifyAction = element => (Array.isArray(actions) ? actions.includes(element) : actions === element);

  const userHasPermission =
    filteredPermissions.valueSeq().flatten().some(verifyAction) || resources === RESOURCES.any || hasIncidentFromCase;

  if (userHasPermission) {
    return children;
  }

  if (redirect) {
    dispatch(push("/not-authorized"));
  }

  return null;
};

Permission.displayName = "Permission";

Permission.defaultProps = {
  redirect: false
};

Permission.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired,
  children: PropTypes.node.isRequired,
  match: PropTypes.object.isRequired,
  redirect: PropTypes.bool.isRequired,
  resources: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};

export default withRouter(Permission);
