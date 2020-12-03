import { fromJS } from "immutable";

// eslint-disable-next-line import/prefer-default-export
export const getUserGroups = state => state.getIn(["records", "user_groups", "data"], fromJS([]));
