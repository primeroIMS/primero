import isEmpty from "lodash/isEmpty";
import { fromJS } from "immutable";
import includes from "lodash/includes";
import { denormalizeFormData } from "../../schemas";
import { NavRecord } from "./records";
import NAMESPACE from "./namespace";

const forms = (state, { recordType, primeroModule }) => {
  const formSections = state.getIn([NAMESPACE, "formSections"]);

  if (isEmpty(formSections)) return null;

  return formSections.filter(
    fs =>
      includes(fs.module_ids, primeroModule) &&
      fs.parent_form === recordType &&
      !fs.is_nested
  );
};

export const getFirstTab = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;

  const firstFormSection = selectedForms.filter(
    fs => fs.get("is_first_tab") === true
  );

  if (firstFormSection && firstFormSection.size > 0) {
    const form = firstFormSection.first();
    return form;
  }

  return null;
};

export const getFormNav = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;
  return selectedForms
    .map(fs =>
      NavRecord({
        group: fs.form_group_id,
        groupName: fs.form_group_name[window.I18n.locale],
        groupOrder: fs.order_form_group,
        name: fs.name[window.I18n.locale],
        order: fs.order,
        formId: fs.unique_id,
        is_first_tab: fs.is_first_tab
      })
    )
    .sortBy(fs => fs.order)
    .groupBy(fs => fs.group)
    .sortBy(fs => fs.first().get("groupOrder"));
};

export const getRecordForms = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;

  return denormalizeFormData(
    fromJS(selectedForms.map(f => f.id - 1)),
    state.getIn(["forms"])
  );
};

export const getOption = (state, option, locale) => {
  if (typeof option === "string") {
    const selectedOptions = state
      .getIn([NAMESPACE, "options"], fromJS([]))
      .filter(o => o.type === option.replace(/lookup /, ""))
      .first();

    return selectedOptions ? selectedOptions.options : [];
  }

  return option[locale];
};

export const getRecord = (state, mode) => {
  if (mode.isEdit || mode.isShow) {
    return state.getIn([NAMESPACE, "selectedRecord"]);
  }

  return null;
};

export const getLoadingState = state =>
  state.getIn([NAMESPACE, "loading"], false);

export const getErrors = state => state.getIn([NAMESPACE, "errors"], false);
