import { Record } from "immutable";

export const ReportRecord = Record({
  id: "",
  name: "",
  description: "",
  graph: false,
  graph_type: "",
  fields: []
});
