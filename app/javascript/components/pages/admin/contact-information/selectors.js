import { fromJS } from "immutable";

export const selectContactInformation = state =>
  state.getIn(["records", "support", "data"], fromJS({}));
