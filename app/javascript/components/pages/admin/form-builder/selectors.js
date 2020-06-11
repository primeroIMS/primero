/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

export const getSelectedForm = state =>
  state.getIn(["records", "admin", "forms", "selectedForm"], fromJS({}));

export const getSelectedSubform = state =>
  state.getIn(
    ["records", "admin", "forms", "selectedFieldSubform"],
    fromJS({})
  );

export const getSelectedSubforms = state =>
  state.getIn(["records", "admin", "forms", "selectedSubforms"], fromJS([]));

export const getSelectedFields = (state, subform) => {
  const fields = subform
    ? state.getIn(
        ["records", "admin", "forms", "selectedFieldSubform", "fields"],
        fromJS([])
      )
    : state.getIn(["records", "admin", "forms", "selectedFields"], fromJS([]));

  return fields.sortBy(field => field.get("order"));
};

export const getSelectedField = state =>
  state.getIn(["records", "admin", "forms", "selectedField"], fromJS({}));

export const getSavingRecord = state =>
  state.getIn(["records", "admin", "forms", "saving"], false);

export const getServerErrors = state =>
  state.getIn(["records", "admin", "forms", "serverErrors"], fromJS([]));

export const getUpdatedFormIds = state =>
  state.getIn(["records", "admin", "forms", "updatedFormIds"], fromJS([]));
