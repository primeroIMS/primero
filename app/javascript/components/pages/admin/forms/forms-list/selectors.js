import { OrderedMap } from "immutable";

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
    .sort(formSection => formSection.order_form_group)
    .toList();
};
