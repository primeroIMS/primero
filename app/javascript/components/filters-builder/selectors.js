import { Map } from "immutable";

export const getFiltersByRecordType = (state, namespace) =>
  state.getIn(["records", namespace, "filters"], Map({}));

export const getFromDashboardFilters = (state, namespace) =>
  state.getIn(["records", namespace, "dashboardFilters"], Map({}));
