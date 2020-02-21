import { fromJS } from "immutable";
import * as yup from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  TEXT_AREA,
  SELECT_FIELD,
  PHOTO_FIELD
} from "../../../form";

export const validations = formMode =>
  yup.object().shape({
    agency_code: yup.string().required(),
    description: yup.string(),
    disabled: yup.boolean(),
    logo_enabled: yup.boolean(),
    logo_full_base64: yup.string(),
    logo_full_file_name: yup.string(),
    name: yup.string().required(),
    services: yup.array(),
    telephone: yup.string()
  });

export const form = (i18n, formMode) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "agencies",
      fields: [
        FieldRecord({
          display_name: i18n.t("agency.name"),
          name: "name",
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("agency.code"),
          name: "agency_code",
          type: TEXT_FIELD,
          required: true
        }),
        FieldRecord({
          display_name: i18n.t("agency.description"),
          name: "description",
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("agency.services"),
          name: "services",
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_source: "lookup-service-type"
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_icon"),
          name: "logo_icon",
          type: PHOTO_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_large"),
          name: "logo_full",
          type: PHOTO_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_enabled"),
          name: "logo_enabled",
          type: TICK_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("agency.disabled"),
          name: "disabled",
          type: TICK_FIELD
        })
      ]
    })
  ]);
};
