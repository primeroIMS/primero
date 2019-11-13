import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { getPermissions } from "../user/selectors";

const Permission = ({
  permissionType,
  permission,
  redirect,
  children,
  match
}) => {
  const { params } = match;
  const { recordType } = params;
  const type = permissionType || recordType;
  const dispatch = useDispatch();
  const allUserPermissions = useSelector(state => getPermissions(state));

  const filteredPermissions = Object.entries(allUserPermissions.toJS()).reduce(
    (acum, curr) => {
      const p = acum;
      const [key, value] = curr;

      if ((Array.isArray(type) && type.includes(key)) || type === key) {
        p[key] = value;
      }

      return p;
    },
    {}
  );

  const userHasPermission = Object.values(filteredPermissions)
    .flat()
    .some(t => permission.includes(t));

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
  children: PropTypes.node.isRequired,
  match: PropTypes.object.isRequired,
  permission: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    .isRequired,
  permissionType: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  redirect: PropTypes.bool.isRequired
};

export default withRouter(Permission);
