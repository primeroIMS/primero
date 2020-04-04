import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD
} from "../../../../form";

import { buildPermissionOptions } from "./utils";

export default (primeroModules, groupPermissions, i18n, formMode) => {
  return FormSectionRecord({
    unique_id: "roles",
    fields: [
      FieldRecord({
        display_name: i18n.t("role.name"),
        name: "name",
        type: "text_field",
        required: true,
        autoFocus: true
      }),
      FieldRecord({
        display_name: i18n.t("role.description"),
        name: "description",
        type: TEXT_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("role.transfer_label"),
        name: "transfer",
        type: TICK_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("role.referral_label"),
        name: "referral",
        type: TICK_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("primero_modules.label"),
        name: "module_ids",
        type: SELECT_FIELD,
        option_strings_text: primeroModules
          .map(primeroModule => ({
            id: primeroModule.unique_id,
            display_text: primeroModule.name
          }))
          .toJS()
      }),
      FieldRecord({
        display_name: i18n.t("role.group_permission_label"),
        name: "group_permission",
        type: SELECT_FIELD,
        option_strings_text: buildPermissionOptions(
          groupPermissions,
          i18n
        ).toJS()
      })
    ]
  });
};