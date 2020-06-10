import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../../form";
import { FORM_CHECK_ERRORS } from "../constants";

import { buildPermissionOptions } from "./utils";

export default (roles, actions, i18n) =>
  FormSectionRecord({
    unique_id: "associated_roles",
    name: i18n.t(`permissions.permission.role`),
    expandable: true,
    expanded: true,
    check_errors: fromJS(FORM_CHECK_ERRORS),
    fields: [
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
      }),
      FieldRecord({
        name: `permissions[role]`,
        type: CHECK_BOX_FIELD,
        option_strings_text: buildPermissionOptions(
          actions,
          i18n,
          "role"
        ).toJS()
      })
    ]
  });
