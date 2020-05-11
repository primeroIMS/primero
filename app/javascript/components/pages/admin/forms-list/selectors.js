import { OrderedMap } from "immutable";

// eslint-disable-next-line import/prefer-default-export
export const getFormSections = (state, filter) => {
  const { primeroModule, recordType } = filter;

  return state
    .getIn(["records", "admin", "forms", "formSections"], OrderedMap({}))
    .filter(
      formSection =>
        !formSection.is_nested &&
        formSection.module_ids.includes(primeroModule) &&
        formSection.parent_form === recordType
    )
    .sortBy(fs => fs.order)
    .groupBy(fs => fs.form_group_id)
    .sortBy(group => group.first().order_form_group)
    .toList();
};

export const getIsLoading = state =>
  state.getIn(["records", "admin", "forms", "loading"], false);
