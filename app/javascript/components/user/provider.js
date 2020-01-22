import { useSelector } from "react-redux";

import { checkPermissions } from "../../libs/permissions";

import { getPermissionsByRecord } from "./selectors";

const usePermissions = (recordType, actions = []) => {
  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  return checkPermissions(userPermissions, actions);
};

export default usePermissions;
