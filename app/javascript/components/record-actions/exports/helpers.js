import { ACTIONS } from "../../../libs/permissions";

import { ALL_EXPORT_TYPES } from "./constants";

export const allowedExports = userPermissions => {
  const exportsTypes = [...ALL_EXPORT_TYPES];
  let allowedExportsOptions = [];

  if (userPermissions.includes(ACTIONS.MANAGE)) {
    allowedExportsOptions = exportsTypes;
  } else {
    allowedExportsOptions = exportsTypes.map(e => {
      if (userPermissions.includes(e.permission)) {
        return e;
      }

      return {};
    });
  }

  return allowedExportsOptions.filter(item => Object.keys(item).length > 0);
};

export const formatFileName = (filename, format) => {
  if (filename) {
    return `${filename.split(" ").join("-")}.${format}`;
  }

  return `generate-export-file.${format}`
};
