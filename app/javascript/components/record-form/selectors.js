import isEmpty from "lodash/isEmpty";
import { fromJS, OrderedMap } from "immutable";

import { denormalizeFormData } from "../../schemas";

import { NavRecord } from "./records";
import NAMESPACE from "./namespace";

const forms = (state, { recordType, primeroModule }) => {
  const formSections = state.getIn([NAMESPACE, "formSections"]);

  if (isEmpty(formSections)) return null;

  return formSections.filter(
    fs =>
      fs.module_ids.includes(primeroModule) &&
      fs.parent_form === recordType &&
      fs.visible &&
      !fs.is_nested
  );
};

export const getFirstTab = (state, query) => {
  const selectedForms = forms(state, query);

  if (selectedForms.isEmpty()) return null;

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

  const denormalizedForms = denormalizeFormData(
    OrderedMap(selectedForms.map(f => f.id)),
    state.getIn(["forms"])
  );

  return denormalizedForms.valueSeq();
};

export const getRecordFormsByUniqueId = (state, query) => {
  const { recordType, primeroModule, formName } = query;

  return getRecordForms(state, { recordType, primeroModule }).filter(
    f => f.unique_id === formName
  );
};

export const getOption = (state, option, locale) => {
  if (typeof option === "string") {
    const selectedOptions = state
      .getIn([NAMESPACE, "options", "lookups", "data"], fromJS([]))
      .filter(o => o.get("unique_id") === option.replace(/lookup /, ""))
      .first();

    return selectedOptions?.size ? selectedOptions.get("values").toJS() : [];
  }

  return option && option[locale] ? option[locale] : [];
};

export const getOptions = state =>
  state.getIn([NAMESPACE, "options", "lookups", "data"], fromJS([]));

export const getLookups = (state, page = 1, per = 20) => {
  const data = state.getIn([NAMESPACE, "options", "lookups"], fromJS({}));

  if (data.size > 0) {
    return fromJS({
      data: data?.get("data")?.slice((page - 1) * per, page * per),
      count: data?.get("data")?.size
    });
  }

  return fromJS({});
};

export const getLocations = state =>
  state.getIn([NAMESPACE, "options", "locations"], fromJS([]));

export const getLoadingState = state =>
  state.getIn([NAMESPACE, "loading"], false);

export const getErrors = state => state.getIn([NAMESPACE, "errors"], false);

export const getSelectedForm = state =>
  state.getIn([NAMESPACE, "selectedForm"]);

export const getSelectedRecord = state =>
  state.getIn([NAMESPACE, "selectedRecord"]);

export const getAssignableForms = state =>
  state
    .getIn([NAMESPACE, "formSections"], fromJS([]))
    .filter(form => !form.get("is_nested") && form.get("visible"));
