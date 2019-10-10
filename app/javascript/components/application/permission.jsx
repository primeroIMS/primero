import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { PERMITTED_URL } from "config";
import { getPermissionsByRecord } from "../user/selectors";

const Permission = ({
  permissionType,
  permission,
  redirect,
  children,
  match
}) => {
  const { params, url } = match;
  const { recordType } = params;
  const type = permissionType || recordType;
  const dispatch = useDispatch();

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, type)
  );
  const userHasPermission =
    userPermissions && userPermissions.toJS().some(t => permission.includes(t));

  if (PERMITTED_URL.includes(url) || userHasPermission) {
    return children;
  }

  if (redirect) {
    dispatch(push("/not-authorized"));
  }

  return null;
};
Permission.defaultProps = {
  redirect: false
};
Permission.propTypes = {
  permission: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    .isRequired,
  permissionType: PropTypes.string,
  redirect: PropTypes.bool,
  children: PropTypes.node.isRequired,
  match: PropTypes.object.isRequired
};

export default withRouter(Permission);
