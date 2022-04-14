/* eslint-disable import/prefer-default-export */
export const checkPermissions = (currentPermissions, allowedPermissions) => {
  return (
    currentPermissions &&
    currentPermissions.filter(permission => {
      return allowedPermissions.includes(permission);
    }).size > 0
  );
};
