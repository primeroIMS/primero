export const NAME = "ExportList";
export const EXPORT_URL = "exports";
export const EXPORT_STATUS = Object.freeze({
  processing: "job.status.processing",
  complete: "job.status.complete"
});
export const EXPORT_COLUMNS = Object.freeze({
  fileName: "file_name",
  recordType: "record_type",
  startedOn: "started_on"
});
