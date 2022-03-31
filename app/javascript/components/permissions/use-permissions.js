import isEmpty from "lodash/isEmpty";
import { useMemo } from "react";

import { useProxySelector } from "../../libs/use-memoized-selector";

import { getPermissionsByRecord } from "./selectors";

const getPermissions = (permittedAbilities, abilities) =>
  !isEmpty(abilities.filter(permission => permittedAbilities.includes(permission)));

const usePermissions = (entity, abilities) => {
  const permittedAbilities = useProxySelector(state => getPermissionsByRecord(state, entity), [entity]);

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
