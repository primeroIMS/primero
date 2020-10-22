import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { getPermissionsByRecord } from "./selectors";

const getPermissions = (permittedAbilities, abilities) =>
  !isEmpty(abilities.filter(permission => permittedAbilities.includes(permission)));

const usePermissions = (entity, abilities) => {
  const permittedAbilities = useSelector(state => getPermissionsByRecord(state, entity));

  if (Array.isArray(abilities)) {
    return getPermissions(permittedAbilities, abilities);
  }

  return {
    ...Object.keys(abilities).reduce((prev, current) => {
      const obj = prev;

      obj[current] = getPermissions(permittedAbilities, abilities[current]);

      return obj;
    }, {}),
    permittedAbilities
  };
};

export default usePermissions;
