import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord } from "../../../form";

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
          type: "textarea",
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.code"),
          name: "code",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.password"),
          name: "password",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.password_confirmation"),
          name: "password_confirmation",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.locale"),
          name: "locale",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.is_manager"),
          name: "is_manager",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.role_ids"),
          name: "role_ids",
          type: "textarea",
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.module_ids"),
          name: "module_ids",
          type: "textarea",
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.user_group_ids"),
          name: "user_group_ids",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.phone"),
          name: "phone",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.email"),
          name: "email",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.organization"),
          name: "organization",
          type: "textarea",
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.agency_office"),
          name: "agency_office",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.position"),
          name: "position",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.location"),
          name: "location",
          type: "textarea",
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("user.disabled"),
          name: "disabled",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.send_email"),
          name: "send_email",
          type: "textarea"
        }),
        FieldRecord({
          display_name: i18n.t("user.verified"),
          name: "verified",
          type: "textarea"
        })
      ]
    })
  ]);
};

export default form;
