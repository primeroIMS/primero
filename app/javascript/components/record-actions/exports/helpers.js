import { ACTIONS } from "../../../libs/permissions";

import { ALL_EXPORT_TYPES } from "./constants";

export const allowedExports = (userPermissions, i18n, isShowPage) => {
  const exportsTypes = [...ALL_EXPORT_TYPES];
  let allowedExportsOptions = [];

  if (userPermissions.includes(ACTIONS.MANAGE)) {
    allowedExportsOptions = exportsTypes.map(exportType => {
      return {
        ...exportType,
        display_name: i18n.t(`exports.${exportType.id}.all`)
      };
    });
  } else {
    allowedExportsOptions = exportsTypes.reduce((acc, obj) => {
      if (userPermissions.includes(obj.permission)) {
        return [
          ...acc,
          { ...obj, display_name: i18n.t(`exports.${obj.id}.all`) }
        ];
      }

      return [...acc, {}];
    }, []);
  }

  const allExports = allowedExportsOptions.filter(
    item => Object.keys(item).length
  );

  if (isShowPage) {
    return allExports.filter(item => !item.showOnlyOnList);
  }

  return allExports;
};

export const formatFileName = (filename, extension) => {
  if (filename && extension) {
    return `${filename}.${extension}`;
  }

  return "";
};
