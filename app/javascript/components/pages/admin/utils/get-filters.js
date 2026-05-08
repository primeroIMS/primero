import { fromJS } from "immutable";

import { FILTER_TYPES } from "../../../index-filters";
import { DISABLED } from "../constants";

export default (i18n, systemPermissions) => {
  const permissions = systemPermissions.get("management", fromJS([])).reduce((acc, permission) => {
    acc.push({
      id: permission,
      display_name: i18n.t(`permissions.resource.group.actions.${permission}.label`)
    });

    return acc;
  }, []);

  return [
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
      name: "roles.filter_by.group_permission",
      field_name: "group_permission",
      options: permissions,
      type: FILTER_TYPES.MULTI_SELECT,
      multiple: true
    }
  ];
};
