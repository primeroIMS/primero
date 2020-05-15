import { OrderedMap, fromJS } from "immutable";

export const formSectionFilter = (formSection, filter) => {
  const { primeroModule, recordType, formGroupId } = filter;

  return (
    !formSection.is_nested &&
    formSection.module_ids.includes(primeroModule) &&
    formSection.parent_form === recordType &&
    (formGroupId ? formSection.form_group_id === formGroupId : true)
  );
};

export const getFormSections = (state, filter) => {
  return state
    .getIn(["records", "admin", "forms", "formSections"], OrderedMap({}))
    .filter(formSection => formSectionFilter(formSection, filter));
};

export const getFormSectionsByFormGroup = (state, filter) =>
  getFormSections(state, filter)
    .sortBy(fs => fs.order)
    .groupBy(fs => fs.form_group_id)
    .sortBy(group => group.first().order_form_group)
    .toList();

export const getIsLoading = state =>
  state.getIn(["records", "admin", "forms", "loading"], false);

export const getIsReorderCompleted = state =>
  Boolean(
    state
      .getIn(
        ["records", "admin", "forms", "reorderedForms", "data"],
        fromJS({})
      )
      .valueSeq()
      .find(status => status.get("reordered") === false)
  ) === false;
