/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { getFields, getFormSections } from "../forms-list/selectors";

export const getSelectedForm = state => state.getIn(["records", "admin", "forms", "selectedForm"], fromJS({}));

export const getSelectedSubform = state => state.getIn(["records", "admin", "forms", "selectedSubform"], fromJS({}));

export const getSelectedSubforms = state => state.getIn(["records", "admin", "forms", "subforms"], fromJS([]));

export const getSelectedFields = (state, subform) => {
  const fields = subform
    ? state.getIn(["records", "admin", "forms", "selectedSubform", "fields"], fromJS([]))
    : state.getIn(["records", "admin", "forms", "selectedFields"], fromJS([]));

  return fields.sortBy(field => field.get("order"));
};

export const getFormUniqueIds = state =>
  getFormSections(state)
    .toList()
    .concat(getSelectedSubforms(state))
    .map(form => form.get("unique_id"))
    .toSet()
    .toList();

export const getFieldNames = state =>
  getFields(state)
    .toList()
    .concat(getSelectedFields(state))
    .concat(getSelectedFields(state, true))
    .concat(
      getSelectedSubforms(state)
        .map(subform => subform.get("fields"))
        .flatten(true)
    )
    .map(field => field.get("name"))
    .toSet()
    .toList();

export const getSelectedSubformField = state =>
  state.getIn(["records", "admin", "forms", "selectedSubformField"], fromJS({}));

export const getSelectedField = state => {
  const subformField = getSelectedSubformField(state);

  if (subformField.toSeq()?.size) {
    return subformField;
  }

  return state.getIn(["records", "admin", "forms", "selectedField"], fromJS({}));
};

export const getSavingRecord = state => state.getIn(["records", "admin", "forms", "saving"], false);

export const getServerErrors = state => state.getIn(["records", "admin", "forms", "serverErrors"], fromJS([]));

export const getUpdatedFormIds = state => state.getIn(["records", "admin", "forms", "updatedFormIds"], fromJS([]));

export const getCopiedFields = state => state.getIn(["records", "admin", "forms", "copiedFields"], fromJS([]));

export const getRemovedFields = state => state.getIn(["records", "admin", "forms", "removedFields"], fromJS([]));
