import { useMemoizedSelector } from "../../libs";
import { checkPermissions } from "../../libs/permissions";

import { getPermissionsByRecord } from "./selectors";

const usePermissions = (recordType, actions = []) => {
  const userPermissions = useMemoizedSelector(state => getPermissionsByRecord(state, recordType));

  return checkPermissions(userPermissions, actions);
};

export default usePermissions;
