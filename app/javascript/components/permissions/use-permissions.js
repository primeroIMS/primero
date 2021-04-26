import isEmpty from "lodash/isEmpty";
import { useMemo } from "react";

import { useMemoizedSelector } from "../../libs";

import { getPermissionsByRecord } from "./selectors";

const getPermissions = (permittedAbilities, abilities) =>
  !isEmpty(abilities.filter(permission => permittedAbilities.includes(permission)));

const usePermissions = (entity, abilities) => {
  const permittedAbilities = useMemoizedSelector(state => getPermissionsByRecord(state, entity));

  const permissions = useMemo(() => {
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
  }, [permittedAbilities, abilities, getPermissions]);

  return permissions;
};

export default usePermissions;
