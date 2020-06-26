import { dataToJS } from "../../../../libs";
import { FILTER_TYPES } from "../../../index-filters";

import { AGENCY, DISABLED } from "./constants";

const searchableAgencies = data => {
  const agencies = dataToJS(data);

  return agencies.reduce(
    (acc, agency) => [...acc, { id: agency.id, display_name: agency.name }],
    []
  );
};

export const buildUsersQuery = data => {
  return Object.entries(data).reduce((acc, obj) => {
    const [key, value] = obj;

    if (key === AGENCY) {
      return { ...acc, [AGENCY]: value?.id };
    }

    return { ...acc, [key]: value };
  }, {});
};

export const getFilters = (i18n, filterAgencies) => [
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
  },
  {
    name: "cases.filter_by.agency",
    field_name: AGENCY,
    options: searchableAgencies(filterAgencies),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: false
  }
];
