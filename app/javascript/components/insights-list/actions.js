import { namespaceActions } from "../../libs";

export default namespaceActions("reports", [
  "FETCH_INSIGHTS",
  "FETCH_INSIGHTS_STARTED",
  "FETCH_INSIGHTS_SUCCESS",
  "FETCH_INSIGHTS_FINISHED",
  "FETCH_INSIGHTS_FAILURE",
  "CLEAR_METADATA",
  "SET_INSIGHT_FILTERS",
  "CLEAR_INSIGHT_FILTERS"
]);
