import { dataToJS } from "../../../../libs";
import { FILTER_TYPES } from "../../../index-filters";

import { TIMESTAMP, USER_NAME } from "./constants";

export const searchableUsers = data => {
  const users = dataToJS(data);

  return users.reduce(
    (acc, user) => [
      ...acc,
      { id: user.user_name, display_name: user.user_name }
    ],
    []
  );
};

export const buildAuditLogsQuery = data => {
  return Object.entries(data).reduce((acc, obj) => {
    const [key, value] = obj;

    if (key === USER_NAME) {
      return { ...acc, [USER_NAME]: value?.id };
    }

    return { ...acc, [key]: value };
  }, {});
};

export const getFilters = filterUsers => [
  {
    name: "audit_log.timestamp",
    field_name: "audit_log_date",
    type: FILTER_TYPES.DATES,
    option_strings_source: null,
    dateIncludeTime: true,
    options: {
      en: [{ id: TIMESTAMP, display_name: "Timestamp" }]
    }
  },
  {
    name: "audit_log.user_name",
    field_name: USER_NAME,
    option_strings_source: null,
    options: searchableUsers(filterUsers),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: false
  }
];
