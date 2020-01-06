import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  CHECK_BOX_FIELD
} from "../../../form";

const form = i18n => {
  return fromJS([
    FormSectionRecord({
      unique_id: "users",
      fields: [
        FieldRecord({
          display_name: i18n.t("user.full_name"),
          name: "full_name",
          type: "text_field",
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("user.user_name"),
          name: "user_name",
          disabled: true,
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.code"),
          name: "code",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.password"),
          name: "password",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.password_confirmation"),
          name: "password_confirmation",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.locale"),
          name: "locale",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.is_manager"),
          name: "is_manager",
          type: TICK_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.role_ids"),
          name: "role_ids",
          type: CHECK_BOX_FIELD,
          required: true,
          option_strings_text: {
            en: [
              { id: "1", display_text: "role" },
              { id: "2", display_text: "role2" }
            ]
          }
        }),
        FieldRecord({
          display_name: i18n.t("user.module_ids"),
          name: "module_ids",
          type: CHECK_BOX_FIELD,
          required: true,
          option_strings_text: {
            en: [
              { id: "1", display_text: "role" },
              { id: "2", display_text: "role2" }
            ]
          }
        }),
        FieldRecord({
          display_name: i18n.t("user.user_group_ids"),
          name: "user_group_ids",
          type: CHECK_BOX_FIELD,
          option_strings_text: {
            en: [
              { id: "1", display_text: "role" },
              { id: "2", display_text: "role2" }
            ]
          }
        }),
        FieldRecord({
          display_name: i18n.t("user.phone"),
          name: "phone",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.email"),
          name: "email",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.organization"),
          name: "organization",
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.agency_office"),
          name: "agency_office",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.position"),
          name: "position",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.location"),
          name: "location",
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.disabled"),
          name: "disabled",
          type: TICK_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.send_email"),
          name: "send_email",
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.verified"),
          name: "verified",
          type: TEXT_FIELD
        })
      ]
    })
  ]);
};

export default form;
