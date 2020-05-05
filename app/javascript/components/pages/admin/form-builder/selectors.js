/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

export const getSelectedForm = state =>
  state.getIn(["records", "admin", "forms", "selectedForm"], fromJS({}));

export const getSelectedFields = state =>
  state.getIn(["records", "admin", "forms", "selectedFields"], fromJS([]));

export const getSelectedField = state =>
  state.getIn(["records", "admin", "forms", "selectedField"], fromJS({}));

export const getSavingRecord = state =>
  state.getIn(["records", "admin", "forms", "saving"], false);
