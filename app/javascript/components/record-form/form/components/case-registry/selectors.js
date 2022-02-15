import { fromJS } from "immutable";

export const getLoading = state => {
  return state.getIn(["records", "registrySearch", "loading"], false);
};

export const getRegistrySearchResults = state => {
  return state.getIn(["records", "registrySearch", "data"], fromJS([]));
};

export const getMetadata = state => {
  return state.getIn(["records", "registrySearch", "metadata"], fromJS({}));
};
