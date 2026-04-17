import last from "lodash/last";

import { FILTER_TYPES } from "../../../index-filters";

import { DISABLED, NAME_DELIMITER, COLUMNS } from "./constants";

export const getFilters = i18n => [
  {
    name: "cases.filter_by.enabled_disabled",
    field_name: DISABLED,
    type: FILTER_TYPES.MULTI_TOGGLE,
    option_strings_source: null,
    options: {
      [i18n.locale]: [
        { id: "false", display_name: i18n.t("disabled.status.enabled") },
        { id: "true", display_name: i18n.t("disabled.status.disabled") }
      ]
    }
  }
];

export const getColumns = (columns, locationTypes) => {
  return columns.map(column => {
    const options = {
      ...{
        ...(column.name === COLUMNS.NAME
          ? {
              customBodyRender: value => {
                const newValue = value.split(NAME_DELIMITER);

                return last(newValue);
              }
            }
          : {})
      },
      ...{
        ...(column.name === COLUMNS.TYPE
          ? {
              customBodyRender: value => {
                // eslint-disable-next-line camelcase
                const valueDisplayText = locationTypes.find(locationType => locationType.id === value)?.display_text;

                return valueDisplayText || value;
              }
            }
          : {})
      }
    };

    return {
      name: column.name,
      label: column.label,
      options
    };
  });
};
