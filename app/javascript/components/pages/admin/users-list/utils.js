import { dataToJS } from "../../../../libs";
import { FILTER_TYPES } from "../../../index-filters";

import { AGENCY, DISABLED, USER_GROUP } from "./constants";

const searchableAgencies = data => {
  const agencies = dataToJS(data);

  return agencies.reduce((acc, agency) => [...acc, { id: agency.id, display_name: agency.name }], []);
};

const userGroupOptions = data => {
  const userGroups = dataToJS(data);

  return userGroups
    ? userGroups.reduce((acc, group) => [...acc, { id: group.unique_id, display_name: group.name }], [])
    : [];
};

export const buildUsersQuery = data => {
  return Object.entries(data).reduce((acc, obj) => {
    const [key, value] = obj;

    if (key === AGENCY) {
      return { ...acc, [AGENCY]: value?.id };
    }
    if (key === USER_GROUP) {
      return { ...acc, [USER_GROUP]: value?.id };
    }

    return { ...acc, [key]: value };
  }, {});
};

export const getFilters = (i18n, filterAgencies, filterUserGroup) => [
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
  },
  {
    name: "cases.filter_by.user_group",
    field_name: USER_GROUP,
    options: userGroupOptions(filterUserGroup),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: false
  }
];
