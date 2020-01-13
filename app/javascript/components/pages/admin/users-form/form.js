import { fromJS } from "immutable";
import * as yup from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../form";

export const validations = (formMode, i18n) =>
  yup.object().shape({
    agency_id: yup.string().required(),
    email: yup.string().required(),
    full_name: yup.string().required(),
    module_unique_ids: yup.array().required(),
    role_unique_id: yup.string().required(),
    user_group_unique_ids: yup.array().required(),
    user_name: yup.string().required(),
    ...(formMode.get("isNew") && { password: yup.string().required() }),
    ...(formMode.get("isNew") && {
      password_confirmation: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          i18n.t("errors.models.user.password_mismatch")
        )
        .required()
    })
  });

export const form = i18n => {
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
          option_strings_text: [
            { id: "role-cp-administrator", display_text: "CP Administrator" },
            { id: "role-cp-case-worker", display_text: "CP Case Worker" },
            { id: "role-cp-manager", display_text: "CP Manager" },
            { id: "role-cp-user-manager", display_text: "CP User Manager" },
            { id: "role-gbv-social-worker", display_text: "GBV Social Worker" },
            { id: "role-gbv-manager", display_text: "GBV Manager" },
            { id: "role-gbv-user-manager", display_text: "GBV User Manager" },
            { id: "role-gbv-caseworker", display_text: "GBV Caseworker" },
            {
              id: "role-gbv-mobile-caseworker",
              display_text: "GBV Mobile Caseworker"
            },
            {
              id: "role-gbv-case-management-supervisor",
              display_text: "GBV Case Management Supervisor"
            },
            {
              id: "role-gbv-program-manager",
              display_text: "GBV Program Manager"
            },
            {
              id: "role-gbv-organization-focal-point",
              display_text: "GBV Organization Focal Point"
            },
            {
              id: "role-agency-user-administrator",
              display_text: "Agency User Administrator"
            },
            {
              id: "role-gbv-agency-user-administrator",
              display_text: "GBV Agency User Administrator"
            },
            {
              id: "role-gbv-system-administrator",
              display_text: "GBV System Administrator"
            },
            { id: "role-referral", display_text: "Referral" },
            { id: "role-transfer", display_text: "Transfer" },
            { id: "role-ftr-manager", display_text: "FTR Manager" },
            { id: "role-superuser", display_text: "Superuser" }
          ]
        }),
        FieldRecord({
          display_name: i18n.t("user.module_ids"),
          name: "module_unique_ids",
          type: CHECK_BOX_FIELD,
          required: true,
          option_strings_text: [
            { id: "primeromodule-cp", display_text: "CP" },
            { id: "primeromodule-gbv", display_text: "GBV" }
          ]
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
          option_strings_text: [{ id: "1", display_text: "UNICEF" }]
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
