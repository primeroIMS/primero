import { OrderedMap, fromJS } from "immutable";

import { filterFormSections, groupByFormGroup } from "./utils";

export const getFormSections = (state, filter) => {
  const formSections = state.getIn(["records", "admin", "forms", "formSections"], OrderedMap({}));

  return filter ? filterFormSections(formSections, filter) : formSections;
};

export const getFields = state => state.getIn(["records", "admin", "forms", "fields"], OrderedMap({}));

export const getFormSectionsByFormGroup = (state, filter) => groupByFormGroup(getFormSections(state, filter)).toList();

export const getIsLoading = state => state.getIn(["records", "admin", "forms", "loading"], false);

export const getReorderIsLoading = state =>
  state.getIn(["records", "admin", "forms", "reorderedForms", "loading"], false);

export const getReorderErrors = state =>
  state.getIn(["records", "admin", "forms", "reorderedForms", "errors"], fromJS([]));

export const getReorderPendings = state =>
  state.getIn(["records", "admin", "forms", "reorderedForms", "pending"], fromJS({}));

export const getReorderEnabled = state =>
  state.getIn(["records", "admin", "forms", "reorderedForms", "enabled"], false);
