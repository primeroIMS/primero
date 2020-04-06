import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  SELECT_FIELD,
  CHECK_BOX_FIELD,
  ERROR_FIELD
} from "../../../../form";
import { FORM_CHECK_ERRORS } from "../constants";

import { buildPermissionOptions } from "./utils";

export default (roles, actions, i18n) => {
  const formNames = {};

  formNames[`${i18n.locale}`] = i18n.t("permissions.label");

  return [
    FormSectionRecord({
      unique_id: "associated_roles",
      name: formNames,
      fields: [
        FieldRecord({
          type: ERROR_FIELD,
          check_errors: fromJS(FORM_CHECK_ERRORS)
        }),
        FieldRecord({
          display_name: i18n.t("role.role_ids_label"),
          name: "permissions[objects][role]",
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_text: (roles.get("data") || fromJS([]))
            .map(role => ({
              id: role.get("unique_id"),
              display_text: role.get("name")
            }))
            .toJS()
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "role_permissions",
      check_errors: fromJS(FORM_CHECK_ERRORS),
      fields: [
        FieldRecord({
          display_name: i18n.t(`permissions.permission.role`),
          name: `permissions[role]`,
          type: CHECK_BOX_FIELD,
          option_strings_text: buildPermissionOptions(actions, i18n).toJS()
        })
      ]
    })
  ];
};
