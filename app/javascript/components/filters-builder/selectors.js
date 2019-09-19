import { Map } from "immutable";

export const selectFiltersByRecordType = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], Map({}));
