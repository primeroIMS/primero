import isEmpty from "lodash/isEmpty";

import { ACTIONS } from "../../../libs/permissions";
import { DEFAULT_FILTERS } from "../../index-filters";

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

export const exporterFilters = (
  isShowPage,
  allCurrentRowsSelected,
  shortIds,
  appliedFilters,
  queryParams,
  record
) => {
  let filters = {};
  const defaultFilters = {
    status: ["open"],
    record_state: ["true"]
  };

  if (isShowPage) {
    filters = { short_id: [record.get("short_id")] };
  } else {
    const applied = appliedFilters.entrySeq().reduce((acc, curr) => {
      const [key, value] = curr;

      if (!["fields", "id_search"].includes(key)) {
        return { ...acc, [key]: value };
      }

      return acc;
    }, {});

    if (allCurrentRowsSelected || shortIds.length) {
      filters = { short_id: shortIds };
    } else if (
      Object.keys(queryParams || {}).length ||
      Object.keys(applied || {}).length
    ) {
      filters = { ...(queryParams || {}), ...(applied || {}) };
    } else {
      filters = defaultFilters;
    }
  }

  const { query, ...restFilters } = filters;

  const returnFilters = Object.keys(restFilters).length
    ? restFilters
    : { short_id: shortIds };

  if (!isEmpty(query)) {
    return { filters: returnFilters, query };
  }

  return {
    filters: returnFilters
  };
};
