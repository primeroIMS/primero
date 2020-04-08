import {
  FieldRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../../form";
import { ROLE_OPTIONS } from "../constants";

export default ({ i18n, formMode }) => ({
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
      required: true,
      editable: false
    }),
    FieldRecord({
      display_name: i18n.t("user.code"),
      name: "code",
      type: TEXT_FIELD
    }),
    FieldRecord({
      display_name: i18n.t("user.password"),
      name: "password",
      type: TEXT_FIELD,
      password: true,
      hideOnShow: true,
      required: formMode.get("isNew")
    }),
    FieldRecord({
      display_name: i18n.t("user.password_confirmation"),
      name: "password_confirmation",
      type: TEXT_FIELD,
      password: true,
      hideOnShow: true,
      required: formMode.get("isNew")
    }),
    FieldRecord({
      display_name: i18n.t("user.locale"),
      name: "locale",
      type: SELECT_FIELD,
      option_strings_text: i18n.applicationLocales.toJS()
    }),
    FieldRecord({
      display_name: i18n.t("user.role_id"),
      name: "role_unique_id",
      type: SELECT_FIELD,
      required: true,
      option_strings_text: ROLE_OPTIONS
    }),
    FieldRecord({
      display_name: i18n.t("user.user_group_unique_ids"),
      name: "user_group_unique_ids",
      type: CHECK_BOX_FIELD,
      required: true,
      option_strings_text: [
        { id: "usergroup-primero-cp", display_text: "Primero CP" },
        { id: "usergroup-primero-ftf", display_text: "Primero FTR" },
        { id: "usergroup-primero-gbv", display_text: "Primero GBV" }
      ]
    }),
    FieldRecord({
      display_name: i18n.t("user.phone"),
      name: "phone",
      type: TEXT_FIELD
    }),
    FieldRecord({
      display_name: i18n.t("user.email"),
      name: "email",
      required: true,
      type: TEXT_FIELD
    }),
    FieldRecord({
      display_name: i18n.t("user.organization"),
      name: "agency_id",
      type: SELECT_FIELD,
      required: true,
      option_strings_source: "Agency"
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
      type: SELECT_FIELD,
      option_strings_source: "Location",
      required: true
    }),
    FieldRecord({
      display_name: i18n.t("user.disabled"),
      name: "disabled",
      type: TICK_FIELD
    }),
    FieldRecord({
      display_name: i18n.t("user.send_mail"),
      name: "send_mail",
      type: TICK_FIELD
    })
  ]
});
