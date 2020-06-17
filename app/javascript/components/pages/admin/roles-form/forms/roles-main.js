import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD
} from "../../../../form";
import { FIELD_NAMES } from "../constants";

import { buildPermissionOptions } from "./utils";

export default (groupPermissions, i18n) => {
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
        display_name: i18n.t("permissions.resource.is_manager.label"),
        name: FIELD_NAMES.isManager,
        type: TICK_FIELD,
        tooltip: i18n.t("permissions.resource.is_manager.explanation")
      }),
      FieldRecord({
        display_name: i18n.t(
          "permissions.resource.transfer.actions.transfer.label"
        ),
        name: FIELD_NAMES.transfer,
        type: TICK_FIELD,
        tooltip: i18n.t(
          "permissions.resource.transfer.actions.transfer.explanation"
        )
      }),
      FieldRecord({
        display_name: i18n.t(
          "permissions.resource.referral.actions.refer.label"
        ),
        name: FIELD_NAMES.referral,
        type: TICK_FIELD,
        tooltip: i18n.t(
          "permissions.resource.referral.actions.refer.explanation"
        )
      }),
      FieldRecord({
        display_name: i18n.t("permissions.resource.module.label"),
        tooltip: i18n.t("permissions.resource.module.explanation"),
        name: FIELD_NAMES.moduleIds,
        type: SELECT_FIELD,
        option_strings_source: "Module",
        multi_select: true
      }),
      FieldRecord({
        display_name: i18n.t("permissions.resource.group.label"),
        tooltip: i18n.t("permissions.resource.group.explanation"),
        name: FIELD_NAMES.groupPermission,
        type: SELECT_FIELD,
        option_strings_text: buildPermissionOptions(
          groupPermissions,
          i18n,
          "group"
        ).toJS()
      })
    ]
  });
};
