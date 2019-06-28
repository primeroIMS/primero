import isEmpty from "lodash/isEmpty";
import { fromJS } from "immutable";
import { denormalizeData } from "./schema";
import { NavRecord } from "./records";

const forms = (state, { recordType, primeroModule }) => {
  const formSections = state.getIn(["forms", "formSections"]);

  if (isEmpty(formSections)) return null;

  return formSections.filter(fs => {
    return (
      fs.get("parent") === recordType &&
      fs.get("module").includes(primeroModule) &&
      !fs.get("is_subform")
    );
  });
};

export const getFormNav = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;

  return selectedForms
    .map(fs =>
      NavRecord({
        group: fs.form_group_id,
        groupOrder: fs.order_form_group,
        name: fs.name[window.I18n.locale],
        order: fs.order,
        formId: fs.id,
        is_first_tab: fs.is_first_tab
      })
    )
    .groupBy(fs => fs.group);
};

export const getRecordForms = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;

  const [...selectedFormKeys] = selectedForms.keys();

  return denormalizeData(fromJS(selectedFormKeys), state.getIn(["forms"]));
};
