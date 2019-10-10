import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
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
  const permittedUrl = ["/login", "/not-authorized", "/dashboard"];
  const dispatch = useDispatch();
  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, type)
  );
  const userHasPermission =
    userPermissions && userPermissions.toJS().some(t => permission.includes(t));

  if (userHasPermission || permittedUrl.includes(url)) {
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
  permission: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  permissionType: PropTypes.string,
  redirect: PropTypes.bool,
  children: PropTypes.node,
  match: PropTypes.object
};

export default withRouter(Permission);
