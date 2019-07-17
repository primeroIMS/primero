import { Map, List } from "immutable";

export const selectRecords = (state, namespace) =>
  state.getIn(["records", namespace, "data"], List([]));

export const selectFilters = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], Map({}));

export const selectMeta = (state, namespace) =>
  state.getIn(["records", namespace, "metadata"], Map({}));

export const selectLoading = (state, namespace) =>
  state.getIn(["records", namespace, "loading"], false);
