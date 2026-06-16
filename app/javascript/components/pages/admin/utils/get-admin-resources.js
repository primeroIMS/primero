import { ADMIN_RESOURCES, ADMIN_ACTIONS } from "../../../permissions/constants";
import { checkPermissions } from "../../../permissions/utils";

export default userPermissions => {
  return ADMIN_RESOURCES.filter(
    adminResource =>
      userPermissions.keySeq().includes(adminResource) &&
      checkPermissions(userPermissions.get(adminResource), ADMIN_ACTIONS)
  );
};
