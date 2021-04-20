import { fromJS } from "immutable";

import { FILTER_TYPES } from "../../../index-filters";

import { AGENCY, DISABLED, USER_GROUP } from "./constants";

const searchableAgencies = (data, i18n) => {
  return data.reduce(
    (acc, agency) => [...acc, { id: agency.get("id"), display_name: agency.getIn(["name", i18n.locale]) }],
    []
  );
};

const userGroupOptions = data => {
  return data
    ? data.reduce((acc, group) => [...acc, { id: group.get("unique_id"), display_name: group.get("name") }], [])
    : [];
};

export const buildUsersQuery = data => {
  return Object.entries(data).reduce((acc, obj) => {
    const [key, value] = obj;

    if ([AGENCY, USER_GROUP].includes(key)) {
      return { ...acc, [key]: value?.id };
    }

    return { ...acc, [key]: value };
  }, {});
};

export const getFilters = (i18n, filterAgencies, filterUserGroups, filterPermission) => [
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
    options: searchableAgencies(filterAgencies, i18n),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: false,
    permitted_filter: filterPermission?.agency
  },
  {
    name: "cases.filter_by.user_group",
    field_name: USER_GROUP,
    options: userGroupOptions(filterUserGroups),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: false
  }
];

export const agencyBodyRender = (i18n, agencies, value) =>
  agencies.get(String(value), fromJS({})).getIn(["name", i18n.locale]);

export const buildObjectWithIds = elems =>
  elems.reduce(
    (previousValue, currentValue) => previousValue.merge(fromJS({ [currentValue.get("id")]: currentValue })),
    fromJS({})
  );
