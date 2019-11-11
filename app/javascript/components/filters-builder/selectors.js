import { Map } from "immutable";

export const getFiltersByRecordType = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], Map({}));
