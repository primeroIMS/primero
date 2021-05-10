import { fromJS } from "immutable";
import { object, string, boolean, array } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  TEXT_AREA,
  SELECT_FIELD,
  PHOTO_FIELD,
  SEPARATOR,
  DOCUMENT_FIELD
} from "../../../form";
import { FILE_FORMAT } from "../../../../config";

import { TERMS_OF_USE, TERMS_OF_USE_ENABLED } from "./constants";

export const validations = i18n =>
  object().shape({
    agency_code: string().required(),
    description: object(),
    disabled: boolean(),
    logo_enabled: boolean(),
    logo_full_base64: string(),
    logo_full_file_name: string(),
    name: object().shape({
      en: string().required(
        i18n.t("forms.required_field", {
          field: i18n.t("agency.name")
        })
      )
    }),
    services: array(),
    telephone: string()
  });

export const form = (i18n, formMode) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "agencies",
      fields: [
        FieldRecord({
          display_name: i18n.t("agency.name"),
          name: "name.en",
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
          name: "description.en",
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
          display_name: i18n.t("agency.terms_of_use_enabled"),
          name: TERMS_OF_USE_ENABLED,
          type: TICK_FIELD
        }),
        FieldRecord({
          display_name: i18n.t("agency.terms_of_use"),
          name: TERMS_OF_USE,
          type: DOCUMENT_FIELD,
          help_text: i18n.t("agency.terms_of_use_help"),
          fileFormat: FILE_FORMAT.pdf,
          renderDownloadButton: true,
          downloadButtonLabel: i18n.t("agency.terms_of_use_download_button"),
          watchedInputs: [TERMS_OF_USE_ENABLED],
          handleWatchedInputs: value => {
            const { terms_of_use_enabled: termsOfUseEnabled } = value;

            return {
              visible: termsOfUseEnabled
            };
          }
        }),
        FieldRecord({
          display_name: i18n.t("agency.agency_logos"),
          type: SEPARATOR
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_icon"),
          name: "logo_icon",
          type: PHOTO_FIELD,
          help_text: i18n.t("agency.logo_icon_help"),
          fileFormat: "image/png"
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_large"),
          name: "logo_full",
          type: PHOTO_FIELD,
          help_text: i18n.t("agency.logo_large_help"),
          fileFormat: "image/png"
        }),
        FieldRecord({
          display_name: i18n.t("agency.logo_enabled"),
          name: "logo_enabled",
          type: TICK_FIELD,
          watchedInputs: ["logo_icon", "logo_full", "logo_full_url", "logo_icon_url"],
          help_text: i18n.t("agency.logo_enabled_help"),
          handleWatchedInputs: value => {
            const {
              logo_full: logoFull,
              logo_icon: logoIcon,
              logo_full_url: logoFullUrl,
              logo_icon_url: logoIconUrl
            } = value;

            return {
              disabled:
                !((logoFull?.length && logoIcon?.length) || (logoIconUrl && logoFullUrl)) || formMode.get("isShow")
            };
          }
        }),
        FieldRecord({
          display_name: i18n.t("agency.pdf_logo_option"),
          name: "pdf_logo_option",
          type: TICK_FIELD,
          watchedInputs: ["logo_icon", "logo_full", "logo_full_url", "logo_icon_url"],
          help_text: i18n.t("agency.pdf_logo_option_help"),
          handleWatchedInputs: value => {
            const {
              logo_full: logoFull,
              logo_icon: logoIcon,
              logo_full_url: logoFullUrl,
              logo_icon_url: logoIconUrl
            } = value;

            return {
              disabled:
                !((logoFull?.length && logoIcon?.length) || (logoIconUrl && logoFullUrl)) || formMode.get("isShow")
            };
          }
        }),
        FieldRecord({
          display_name: i18n.t("agency.exclude_agency_from_lookups"),
          name: "exclude_agency_from_lookups",
          type: TICK_FIELD,
          help_text: i18n.t("agency.exclude_agency_from_lookups_help")
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
