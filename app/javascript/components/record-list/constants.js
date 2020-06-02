export const NAME = "RecordListContainer";
export const ALERTS = "alerts";
export const ALERTS_COLUMNS = Object.freeze({
  alert_count: "alert_count",
  flag_count: "flag_count",
  photo: "photo"
});
export const FILTER_CONTAINER_NAME = `${NAME}FilterContainer`;
export const DEFAULT_FILTERS = {
  fields: "short",
  status: ["open"],
  record_state: ["true"]
};
