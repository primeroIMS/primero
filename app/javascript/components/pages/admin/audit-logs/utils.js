// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FILTER_TYPES } from "../../../index-filters";

import { AUDIT_LOG_ACTIONS, RECORD_TYPE, TIMESTAMP, USER_NAME } from "./constants";

function calculateApprovalLabel(approvalAction) {
  const match = approvalAction.match(/^(.*)_(approved|rejected|requested)$/);

  if (match) {
    return match[1];
  }

  return null;
}

function parseAuditLogOptions(i18n, options, key) {
  return (
    options?.reduce(
      (prev, current) => [
        ...prev,
        {
          id: current,
          display_name: i18n.t(`logger.${key}.${current}`, {
            approval_label: i18n.t(`cases.${calculateApprovalLabel(current)}`)
          })
        }
      ],
      []
    ) || []
  );
}

export const searchableUsers = (data = []) => {
  return data.reduce((acc, user) => [...acc, { id: user.get("user_name"), display_name: user.get("user_name") }], []);
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

export const getFilters = (filterUsers, i18n, actions, recordTypes) => [
  {
    name: "audit_log.timestamp",
    field_name: "audit_log_date",
    type: FILTER_TYPES.DATES,
    option_strings_source: null,
    dateIncludeTime: true,
    options: {
      [i18n.locale]: [{ id: TIMESTAMP, display_name: i18n.t("logger.timestamp") }]
    }
  },
  {
    name: "audit_log.user_name",
    field_name: USER_NAME,
    option_strings_source: null,
    options: searchableUsers(filterUsers),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: false
  },
  {
    name: "audit_log.action",
    field_name: AUDIT_LOG_ACTIONS,
    option_strings_source: null,
    options: parseAuditLogOptions(i18n, actions, "actions"),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: true
  },
  {
    name: "audit_log.type",
    field_name: RECORD_TYPE,
    option_strings_source: null,
    options: parseAuditLogOptions(i18n, recordTypes, "resources"),
    type: FILTER_TYPES.MULTI_SELECT,
    multiple: true
  }
];
