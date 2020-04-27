/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

export const getSelectedForm = state => {
  return state.getIn(["records", "admin", "forms", "selectedForm"], fromJS({}));
};

export const getSavingRecord = state =>
  state.getIn(["records", "admin", "forms", "saving"], false);
