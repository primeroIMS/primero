export const PERMISSION_CONSTANTS = {
  TRANSFER: "transfer",
  MANAGE: "manage",
  ASSIGN: "assign",
  ASSIGN_WITHIN_USER_GROUP: "assign_within_user_group",
  ASSIGN_WITHIN_AGENCY_PERMISSIONS: "assign_within_agency permissions",
  REOPEN: "reopen",
  CLOSE: "close",
  ENABLE_DISABLE_RECORD: "enable_disable_record",
  ADD_NOTE: "add_note",
  READ: "read",
  REFERRAL: "referral",
  DISPLAY_VIEW_PAGE: "display_view_page",
  SEARCH_OWNED_BY_OTHERS: "search_owned_by_others"
}

export const checkPermissions = (currentPermissions, allowedPermissions) => {
  return (
    currentPermissions &&
    currentPermissions.filter(permission => {
      return allowedPermissions.includes(permission);
    }).size > 0
  );
};
