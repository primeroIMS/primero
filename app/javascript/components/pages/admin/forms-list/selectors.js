import { OrderedMap, fromJS } from "immutable";

import { filterFormSections, groupByFormGroup } from "./utils";

const adminFormsPath = ["records", "admin", "forms"];

export const getFormSections = (state, filter) => {
  const formSections = state.getIn([...adminFormsPath, "formSections"], OrderedMap({}));

  return filter ? filterFormSections(formSections, filter) : formSections;
};

export const getFields = state => state.getIn([...adminFormsPath, "fields"], OrderedMap({}));

export const getFieldsByIds = (state, ids) =>
  ids
    .map(id => state.getIn([...adminFormsPath, "fields", id.toString()]))
    .filter(field => Boolean(field?.toSeq()?.size));

export const getFormSectionsByFormGroup = (state, filter) => groupByFormGroup(getFormSections(state, filter)).toList();

export const getIsLoading = state => state.getIn([...adminFormsPath, "loading"], false);

export const getReorderIsLoading = state => state.getIn([...adminFormsPath, "reorderedForms", "loading"], false);

export const getReorderErrors = state => state.getIn([...adminFormsPath, "reorderedForms", "errors"], fromJS([]));

export const getReorderPendings = state => state.getIn([...adminFormsPath, "reorderedForms", "pending"], fromJS({}));

export const getReorderEnabled = state => state.getIn([...adminFormsPath, "reorderedForms", "enabled"], false);

export const getExportedForms = state => state.getIn([...adminFormsPath, "export", "data"], false);
