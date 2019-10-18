export const MANAGE = "manage";
export const ASSIGN = "assign";
export const ASSIGN_WITHIN_USER_GROUP = "assign_within_user_group";
export const ASSIGN_WITHIN_AGENCY_PERMISSIONS =
  "assign_within_agency permissions";
export const REOPEN = "reopen";
export const CLOSE = "close";
export const ENABLE_DISABLE_RECORD = "enable_disable_record";
export const ADD_NOTE = "add_note";
export const READ = "read";

export const check = (currentPermissions, allowedPermissions) => {
  return (
    currentPermissions &&
    currentPermissions.filter(permission => {
      return allowedPermissions.includes(permission);
    }).size > 0
  );
};
