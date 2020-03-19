import { OrderedMap } from "immutable";

// TODO: Get by  module_ids / parent_form
export const getFormSections = state =>
  state
    .getIn(["admin", "forms", "formSections"], OrderedMap({}))
    .filter(formSection => !formSection.is_nested)
    .sortBy(fs => fs.order)
    .groupBy(fs => fs.form_group_id)
    .sort(formSection => formSection.order_form_group)
    .toList();
