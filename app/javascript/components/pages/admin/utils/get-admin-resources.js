// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { ADMIN_RESOURCES } from "../../../permissions/constants";

export default userPermissions =>
  ADMIN_RESOURCES.filter(
    adminResource => userPermissions.keySeq().includes(adminResource) && userPermissions.get(adminResource).size > 0
  );
