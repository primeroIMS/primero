import { ACTIONS } from "../../../libs/permissions";

import { ALL_EXPORT_TYPES } from "./constants";

export const allowedExports = userPermissions => {
  const exportsTypes = [...ALL_EXPORT_TYPES];
  let allowedExportsOptions = [];

  if (userPermissions.includes(ACTIONS.MANAGE)) {
    allowedExportsOptions = exportsTypes;
  } else {
    allowedExportsOptions = exportsTypes
      .reduce((acc, obj) => {
        if (userPermissions.includes(obj.permission)) {
          return [...acc, obj];
        }

        return [...acc, {}];
      }, [])
      .filter(exportType => Object.keys(exportType).length);
  }

  return allowedExportsOptions.filter(item => Object.keys(item).length);
};

export const formatFileName = (filename, extension) => {
  if (filename && extension) {
    return `${filename}.${extension}`;
  }

  return "";
};
