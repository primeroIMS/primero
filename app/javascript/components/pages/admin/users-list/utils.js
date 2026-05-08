import { fromJS } from "immutable";

import { FILTER_TYPES } from "../../../index-filters";

import { AGENCY, DISABLED, USER_GROUP, LAST_DATE, DISABLE_DIALOG_NAME, ACTION_NAMES, ACTION_IDS } from "./constants";

const searchableAgencies = (data, i18n) => {
  return data.reduce(
    (acc, agency) => [...acc, { id: agency.get("id"), display_name: agency.getIn(["name", i18n.locale]) }],
    []
  );
};

const searchableRoles = data => {
  return data?.reduce((acc, role) => [...acc, { id: role.get("id"), display_name: role.get("name") }], []);
};

const userGroupOptions = data => {
  return data
    ? data.reduce((acc, group) => [...acc, { id: group.get("unique_id"), display_name: group.get("name") }], [])
    : [];
};

export const getFilters = (i18n, filterAgencies, filterUserGroups, filterPermission, roles) => [
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
    multiple: true,
    permitted_filter: filterPermission?.agency
  },
  {
    name: "cases.filter_by.role",
    field_name: "role_id",
    options: searchableRoles(roles),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: true
  },
  {
    name: "cases.filter_by.user_group",
    field_name: USER_GROUP,
    options: userGroupOptions(filterUserGroups),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: true
  },
  {
    name: "cases.filter_by.by_date",
    field_name: LAST_DATE,
    type: FILTER_TYPES.DATES,
    options: {
      [i18n.locale]: [
        { id: "last_access", display_name: i18n.t("users.filters.date_last_login") },
        { id: "last_case_viewed", display_name: i18n.t("users.filters.date_last_case_view") },
        { id: "last_case_updated", display_name: i18n.t("users.filters.date_last_case_updated") }
      ]
    }
  }
];

export const agencyBodyRender = (i18n, agencies, value) =>
  agencies.get(String(value), fromJS({})).getIn(["name", i18n.locale]);

export const roleBodyRender = (roles, value) => {
  return roles.filter(role => role.get("unique_id") === value).getIn([0, "name"]);
};

export const buildObjectWithIds = elems =>
  elems.reduce(
    (previousValue, currentValue) => previousValue.merge(fromJS({ [currentValue.get("id")]: currentValue })),
    fromJS({})
  );

export const buildActionList = ({ i18n, handleDialogClick, canDisableMultiple }) => {
  const actions = [
    {
      id: ACTION_IDS.disable,
      name: i18n.t("actions.disable"),
      disableOffline: true,
      condition: canDisableMultiple,
      action: () => handleDialogClick(DISABLE_DIALOG_NAME, ACTION_NAMES.disable)
    }
  ];

  return actions.filter(action => {
    if (action.condition) {
      return action;
    }

    return null;
  });
};
