import { ACTIONS } from "../../../libs/permissions";
import { RECORD_PATH } from "../../../config/constants";

export const EXPORT_FORMAT = Object.freeze({
  JSON: "json",
  CSV: "csv",
  EXCEL: "xlsx",
  PDF: "pdf",
  CUSTOM: "custom"
});

export const NAME = "Exports";

export const ALL_EXPORT_TYPES = Object.freeze([
  Object.freeze({
    id: "pdf",
    permission: ACTIONS.EXPORT_PDF,
    format: EXPORT_FORMAT.PDF,
    recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents],
    hideOnShowPage: true
  }),
  Object.freeze({
    id: "csv",
    permission: ACTIONS.EXPORT_CSV,
    format: EXPORT_FORMAT.CSV,
    recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests]
  }),
  Object.freeze({
    id: "xlsx",
    permission: ACTIONS.EXPORT_EXCEL,
    format: EXPORT_FORMAT.EXCEL,
    recordTypes: [RECORD_PATH.cases, RECORD_PATH.tracing_requests]
  }),
  Object.freeze({
    id: "json",
    permission: ACTIONS.EXPORT_JSON,
    format: EXPORT_FORMAT.JSON,
    recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests]
  }),
  Object.freeze({
    id: "photowall",
    permission: ACTIONS.EXPORT_PHOTO_WALL,
    format: EXPORT_FORMAT.PDF,
    message: "exports.photowall.success_message",
    recordTypes: [RECORD_PATH.cases]
  }),
  Object.freeze({
    id: "unhcr_csv",
    permission: ACTIONS.EXPORT_UNHCR,
    format: EXPORT_FORMAT.CSV,
    recordTypes: [RECORD_PATH.cases]
  }),
  Object.freeze({
    id: "list_view_csv",
    permission: ACTIONS.EXPORT_LIST_VIEW,
    format: EXPORT_FORMAT.CSV,
    showOnlyOnList: true,
    recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests]
  }),
  Object.freeze({
    id: "duplicate_id_csv",
    permission: ACTIONS.EXPORT_DUPLICATE_ID,
    format: EXPORT_FORMAT.CSV,
    showOnlyOnList: true,
    recordTypes: [RECORD_PATH.cases]
  }),
  Object.freeze({
    id: "custom",
    permission: ACTIONS.EXPORT_CUSTOM,
    format: EXPORT_FORMAT.EXCEL,
    recordTypes: [RECORD_PATH.cases, RECORD_PATH.tracing_requests]
  }),
  Object.freeze({
    id: "incident_recorder_xls",
    permission: ACTIONS.EXPORT_INCIDENT_RECORDER,
    format: EXPORT_FORMAT.EXCEL,
    recordTypes: [RECORD_PATH.incidents]
  })
]);

export const FIELD_ID = "field";
export const FORMS_ID = "forms";
export const EXPORT_TYPE_FIELD = "export_type";
export const MODULE_FIELD = "module";
export const CUSTOM_FORMAT_TYPE_FIELD = "custom_format_type";
export const INDIVIDUAL_FIELDS_FIELD = "individual_fields";
export const FORM_TO_EXPORT_FIELD = "form_unique_ids";
export const FIELDS_TO_EXPORT_FIELD = "field_names";
export const HEADER = "header";
export const CUSTOM_HEADER = "custom_header";
export const INCLUDE_IMPLEMENTATION_LOGOS = "include_implementation_logos";
export const INCLUDE_AGENCY_LOGO = "include_agency_logos";
export const INCLUDE_OTHER_LOGOS = "include_other_logos";
export const SIGNATURES = "signatures";
export const FILTERS_TO_SKIP = Object.freeze(["fields", "id_search", "per", "page", "total"]);
export const PASSWORD_FIELD = "password";
export const CUSTOM_EXPORT_FILE_NAME_FIELD = "custom_export_file_name";
export const CASE_WORKER = "case_worker";
export const CLIENT = "client";
export const RECIPIENT = "recipient";
