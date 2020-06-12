import { fromJS } from "immutable";
import { object, string, boolean, array } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  TEXT_AREA,
  SELECT_FIELD,
  PHOTO_FIELD
} from "../../../form";

export const validations = () =>
  object().shape({
    agency_code: string().required(),
    description: string(),
    disabled: boolean(),
    logo_enabled: boolean(),
    logo_full_base64: string(),
    logo_full_file_name: string(),
    name: string().required(),
    services: array(),
    telephone: string()
  });

export const form = i18n => {
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
          type: PHOTO_FIELD,
          help_text: i18n.t("agency.logo_icon_help")
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_large"),
          name: "logo_full",
          type: PHOTO_FIELD,
          help_text: i18n.t("agency.logo_large_help")
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_enabled"),
          name: "logo_enabled",
          type: TICK_FIELD,
          watchedInputs: ["logo_icon", "logo_full"],
          help_text: i18n.t("agency.logo_enabled_help"),
          handleWatchedInputs: value => {
            const { logo_full: logoFull, logo_icon: logoIcon } = value;

            return {
              disabled: !(logoFull?.length && logoIcon?.length)
            };
          }
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
