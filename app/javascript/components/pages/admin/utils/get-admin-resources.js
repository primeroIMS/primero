import { ADMIN_RESOURCES } from "../../../../libs/permissions";

export default userPermissions =>
  ADMIN_RESOURCES.filter(
    adminResource => userPermissions.keySeq().includes(adminResource) && userPermissions.get(adminResource).size > 0
  );
