import { push } from "connected-react-router";
import { Map } from "immutable";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { INCIDENT_FROM_CASE, MODES } from "../../config";
import { useMemoizedSelector } from "../../libs";
import { RESOURCES } from "../../libs/permissions";
import { getPermissions } from "../user/selectors";

const Permission = ({ resources, actions = [], redirect = false, children }) => {
  const { recordType } = useParams();

  const type = resources || recordType;
  const dispatch = useDispatch();

  const allUserPermissions = useMemoizedSelector(state => getPermissions(state));

  const filteredPermissions = useMemo(
    () =>
      allUserPermissions.entrySeq().reduce((acum, [key, value]) => {
        if ((Array.isArray(type) && type.includes(key)) || type === key) {
          return acum.set(key, value);
        }

        return acum;
      }, Map({})),
    [type]
  );

  const hasIncidentFromCase = useMemo(
    () =>
      type === RESOURCES.incidents &&
      children?.props?.mode === MODES.new &&
      allUserPermissions
        .entrySeq()
        .some(([key, value]) => key === RESOURCES.cases && value.some(permission => permission === INCIDENT_FROM_CASE)),
    [type, children?.props?.mode]
  );

  const verifyAction = element => (Array.isArray(actions) ? actions.includes(element) : actions === element);

  const userHasPermission = useMemo(
    () =>
      filteredPermissions.valueSeq().flatten().some(verifyAction) || resources === RESOURCES.any || hasIncidentFromCase,
    [verifyAction, hasIncidentFromCase, resources]
  );

  if (userHasPermission) {
    return children;
  }

  if (redirect) {
    dispatch(push("/not-authorized"));
  }

  return null;
};

Permission.displayName = "Permission";

Permission.propTypes = {
  actions: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  children: PropTypes.node.isRequired,
  redirect: PropTypes.bool,
  resources: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};

export default Permission;
