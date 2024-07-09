// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import { useMemo } from "react";

import { useProxySelector } from "../../libs/use-memoized-selector";

import { getPermissionsByRecord } from "./selectors";

const getPermissions = (permittedAbilities, abilities) => {
  if (Array.isArray(abilities)) {
    return !isEmpty(abilities.filter(permission => permittedAbilities.includes(permission)));
  }

  return permittedAbilities.includes(abilities);
};

const usePermissions = (entity, abilities) => {
  const permittedAbilities = useProxySelector(state => getPermissionsByRecord([state, entity]), [entity]);

  const permissions = useMemo(() => {
    if (Array.isArray(abilities) || typeof abilities === "string") {
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
  }, [permittedAbilities, abilities]);

  return permissions;
};

export default usePermissions;
