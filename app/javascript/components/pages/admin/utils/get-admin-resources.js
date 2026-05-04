import { ACTIONS, ADMIN_RESOURCES } from "../../../permissions/constants";

export default userPermissions => {
  return ADMIN_RESOURCES.filter(
    adminResource =>
      userPermissions.keySeq().includes(adminResource) &&
      (userPermissions.get(adminResource).includes(ACTIONS.MANAGE) ||
        userPermissions.get(adminResource).includes(ACTIONS.MANAGE_RESTRICTED)) &&
      userPermissions.get(adminResource).size > 0
  );
};
