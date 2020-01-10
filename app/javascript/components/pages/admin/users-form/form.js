import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
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
          type: TEXT_FIELD,
          password: true,
          hideOnShow: true
        }),
        FieldRecord({
          display_name: i18n.t("user.password_confirmation"),
          name: "password_confirmation",
          type: TEXT_FIELD,
          password: true,
          hideOnShow: true
        }),
        // TODO: Where to get locales from?
        FieldRecord({
          display_name: i18n.t("user.locale"),
          name: "locale",
          type: SELECT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.is_manager"),
          name: "is_manager",
          type: TICK_FIELD
        }),
        // TODO: Removing till we figure out how to get options
        FieldRecord({
          display_name: i18n.t("user.role_id"),
          name: "role_id",
          type: SELECT_FIELD,
          required: true,
          option_strings_text: [
            { id: "1", display_text: "CP Administrator" },
            { id: "2", display_text: "CP Case Worker" },
            { id: "3", display_text: "CP Manager" },
            { id: "4", display_text: "CP User Manager" },
            { id: "5", display_text: "GBV Social Worker" },
            { id: "6", display_text: "GBV Manager" },
            { id: "7", display_text: "GBV User Manager" },
            { id: "8", display_text: "GBV Caseworker" },
            { id: "9", display_text: "GBV Mobile Caseworker" },
            { id: "10", display_text: "GBV Case Management Supervisor" },
            { id: "11", display_text: "GBV Program Manager" },
            { id: "12", display_text: "GBV Organization Focal Point" },
            { id: "13", display_text: "Agency User Administrator" },
            { id: "14", display_text: "GBV Agency User Administrator" },
            { id: "15", display_text: "GBV System Administrator" },
            { id: "16", display_text: "Referral" },
            { id: "17", display_text: "Transfer" },
            { id: "18", display_text: "FTR Manager" },
            { id: "19", display_text: "Superuser" }
          ]
        }),
        FieldRecord({
          display_name: i18n.t("user.module_ids"),
          name: "module_ids",
          type: CHECK_BOX_FIELD,
          required: true,
          option_strings_text: [
            { id: "1", display_text: "CP" },
            { id: "2", display_text: "GBV" }
          ]
        }),
        FieldRecord({
          display_name: i18n.t("user.user_group_ids"),
          name: "user_group_ids",
          type: CHECK_BOX_FIELD,
          option_strings_text: [
            { id: "1", display_text: "Primero CP" },
            { id: "2", display_text: "Primero FTR" },
            { id: "3", display_text: "Primero GBV" }
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
          type: TEXT_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("user.organization"),
          name: "agency_id",
          type: SELECT_FIELD,
          option_strings_text: [{ id: 1, display_text: "UNICEF" }]
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
          required: true,
          option_strings_source: "location"
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
    })
  ]);
};

export default form;
