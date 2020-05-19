import { ACTIONS } from "../../../libs/permissions";

export const EXPORT_FORMAT = Object.freeze({
  JSON: "json",
  CSV: "csv",
  EXCEL: "xls",
  PDF: "pdf"
});

export const NAME = "Exports";
export const ALL_EXPORT_TYPES = Object.freeze([
  Object.freeze({
    id: "csv",
    permission: ACTIONS.EXPORT_CSV,
    format: EXPORT_FORMAT.CSV
  }),
  Object.freeze({
    id: "xls",
    permission: ACTIONS.EXPORT_EXCEL,
    format: EXPORT_FORMAT.EXCEL
  }),
  Object.freeze({
    id: "json",
    permission: ACTIONS.EXPORT_JSON,
    format: EXPORT_FORMAT.JSON
  }),
  Object.freeze({
    id: "photowall",
    permission: ACTIONS.EXPORT_PHOTO_WALL,
    format: EXPORT_FORMAT.PDF,
    message: "exports.photowall.success_message"
  }),
  Object.freeze({
    id: "unhcr_csv",
    permission: ACTIONS.EXPORT_UNHCR,
    format: EXPORT_FORMAT.CSV
  }),
  Object.freeze({
    id: "list_view_csv",
    permission: ACTIONS.EXPORT_LIST_VIEW,
    format: EXPORT_FORMAT.CSV,
    showOnlyOnList: true
  }),
  Object.freeze({
    id: "duplicate_id_csv",
    permission: ACTIONS.EXPORT_DUPLICATE_ID,
    format: EXPORT_FORMAT.CSV,
    showOnlyOnList: true
  }),
  Object.freeze({
    id: "custom_exports",
    permission: ACTIONS.EXPORT_CUSTOM,
    format: EXPORT_FORMAT.CSV
  })
]);

export const FIELD_ID = "field";
export const FORMS_ID = "forms";
export const EXPORT_TYPE_FIELD = "export_type";
export const CUSTOM_FORMAT_TYPE_FIELD = "custom_format_type";
export const INDIVIDUAL_FIELDS_FIELD = "individual_fields";
export const FORM_TO_EXPORT_FIELD = "form_to_export";
export const FIELDS_TO_EXPORT_FIELD = "fields_to_export";
export const PASSWORD_FIELD = "password";
export const CUSTOM_EXPORT_FILE_NAME_FIELD = "custom_export_file_name";
