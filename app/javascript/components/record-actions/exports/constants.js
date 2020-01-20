import { ACTIONS } from "../../../libs/permissions";

const EXPORT_FORMAT = Object.freeze({
  JSON: "json",
  CSV: "csv",
  EXCEL: "xls",
  PDF: "pdf"
});

export const NAME = "Exports";
export const ALL_EXPORT_TYPES = Object.freeze([
  {
    id: "csv",
    display_name: "CSV",
    permission: ACTIONS.EXPORT_CSV,
    format: EXPORT_FORMAT.CSV
  },
  {
    id: "excel",
    display_name: "Excel",
    permission: ACTIONS.EXPORT_EXCEL,
    format: EXPORT_FORMAT.EXCEL
  },
  {
    id: "json",
    display_name: "JSON",
    permission: ACTIONS.EXPORT_JSON,
    format: EXPORT_FORMAT.JSON
  },
  {
    id: "pdf",
    display_name: "Photo Wall",
    permission: ACTIONS.EXPORT_PHOTO_WALL,
    format: EXPORT_FORMAT.PDF
  },
  {
    id: "unhcr",
    display_name: "UNHCR",
    permission: ACTIONS.EXPORT_UNHCR,
    format: EXPORT_FORMAT.CSV
  }
]);
