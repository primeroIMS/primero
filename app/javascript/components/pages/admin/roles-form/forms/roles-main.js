import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD
} from "../../../../form";
import { FIELD_NAMES } from "../constants";

import { buildPermissionOptions } from "./utils";

export default (primeroModules, groupPermissions, i18n) => {
  return FormSectionRecord({
    unique_id: "roles",
    fields: [
      FieldRecord({
        display_name: i18n.t("role.name"),
        name: FIELD_NAMES.name,
        type: "text_field",
        required: true,
        autoFocus: true
      }),
      FieldRecord({
        display_name: i18n.t("role.description"),
        name: FIELD_NAMES.description,
        type: TEXT_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("role.transfer_label"),
        name: FIELD_NAMES.transfer,
        type: TICK_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("role.referral_label"),
        name: FIELD_NAMES.referral,
        type: TICK_FIELD
      }),
      FieldRecord({
        display_name: i18n.t("primero_modules.label"),
        name: FIELD_NAMES.moduleIds,
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
        name: FIELD_NAMES.groupPermission,
        type: SELECT_FIELD,
        option_strings_text: buildPermissionOptions(
          groupPermissions,
          i18n
        ).toJS()
      })
    ]
  });
};
