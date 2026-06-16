import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, SELECT_FIELD, CHECK_BOX_FIELD, OPTION_TYPES } from "../../../../form";
import { FORM_CHECK_ERRORS } from "../constants";

import { buildPermissionOptions } from "./utils";

export default (actions, i18n) =>
  FormSectionRecord({
    unique_id: "associated_roles",
    name: i18n.t(`permissions.permission.role`),
    expandable: true,
    expanded: true,
    check_errors: fromJS(FORM_CHECK_ERRORS),
    fields: [
      FieldRecord({
        display_name: i18n.t("permissions.resource.role.actions.permitted_roles.label"),
        name: "permissions.objects.role",
        type: SELECT_FIELD,
        multi_select: true,
        tooltip: i18n.t("permissions.resource.role.actions.permitted_roles.explanation"),
        watchedInputs: ["permissions.objects.role"],
        option_strings_source: OPTION_TYPES.ROLE_PERMITTED
      }),
      FieldRecord({
        name: `permissions.role`,
        type: CHECK_BOX_FIELD,
        option_strings_text: buildPermissionOptions(actions, i18n, "role")
      })
    ]
  });
