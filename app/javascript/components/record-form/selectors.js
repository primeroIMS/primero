import isEmpty from "lodash/isEmpty";
import { fromJS, OrderedMap } from "immutable";

import { denormalizeFormData } from "../../schemas";
import { displayNameHelper } from "../../libs";

import { NavRecord } from "./records";
import NAMESPACE from "./namespace";

const forms = (state, { recordType, primeroModule, checkVisible, all, formsIds }) => {
  const allFormSections = state.getIn([NAMESPACE, "formSections"]);

  if (isEmpty(allFormSections)) return null;

  if (all) {
    return allFormSections;
  }

  const userFormSection = formsIds ? allFormSections.filter(fs => formsIds.includes(fs.unique_id)) : allFormSections;

  const formSections = userFormSection.filter(
    fs =>
      (Array.isArray(primeroModule)
        ? fs.module_ids.some(mod => primeroModule.includes(mod))
        : fs.module_ids.includes(primeroModule)) &&
      fs.parent_form === recordType &&
      !fs.is_nested
  );

  if (checkVisible === false) {
    return formSections;
  }

  return formSections.filter(fs => fs.visible);
};

const isAStickyOption = (opt, stickyOption) =>
  Array.isArray(stickyOption) ? stickyOption.includes(opt.id) : opt.id === stickyOption.toString();

const addingDeletedOption = (enabledOptions, locale, stickyOption) => {
  if (!stickyOption || Boolean(enabledOptions.filter(opt => isAStickyOption(opt, stickyOption)).length)) {
    return enabledOptions;
  }

  enabledOptions.push({
    id: stickyOption,
    disabled: true,
    display_text: { [locale]: stickyOption }
  });

  return enabledOptions;
};

const transformOptionSource = (options, locale, stickyOption) => {
  if (!options || !Array.isArray(options)) {
    return [];
  }
  const enabledOptions = options.filter(fs => !fs.disabled || isAStickyOption(fs, stickyOption)) || [];

  const optionsToRender = addingDeletedOption(enabledOptions, locale, stickyOption);

  return optionsToRender.map(opt => ({
    id: opt.id,
    isDisabled: Boolean(opt.disabled),
    display_text: displayNameHelper(opt.display_text, locale) || ""
  }));
};

export const getFirstTab = (state, query) => {
  const selectedForms = forms(state, query);

  if (selectedForms.isEmpty()) return null;

  const firstFormSection = selectedForms.filter(fs => fs.get("is_first_tab") === true);

  if (firstFormSection && firstFormSection.size > 0) {
    const form = firstFormSection.first();

    return form;
  }

  return selectedForms.first();
};

export const getFormNav = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;

  return selectedForms
    .map(fs =>
      NavRecord({
        group: fs.form_group_id,
        groupOrder: fs.order_form_group,
        name: displayNameHelper(fs.name, window.I18n.locale),
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
  const denormalizedForms = denormalizeFormData(OrderedMap(selectedForms.map(f => f.id)), state.getIn(["forms"]));

  return denormalizedForms.valueSeq();
};

export const getRecordFormsByUniqueId = (state, query) => {
  const { recordType, primeroModule, formName, checkVisible } = query;

  return getRecordForms(state, {
    recordType,
    primeroModule,
    checkVisible
  }).filter(f => f.unique_id === formName);
};

export const getOption = (state, option, locale, stickyOption = "") => {
  let options = option;

  if (typeof option === "string") {
    const selectedOptions = state
      .getIn([NAMESPACE, "options", "lookups"], fromJS([]))
      .filter(o => o.get("unique_id") === option.replace(/lookup /, ""))
      .first();

    options = selectedOptions?.size ? selectedOptions.get("values").toJS() : [];
  }

  return transformOptionSource(options, locale, stickyOption);
};

export const getOptions = state => state.getIn([NAMESPACE, "options", "lookups"], fromJS([]));

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

export const getLocations = state => state.getIn([NAMESPACE, "options", "locations"], fromJS([]));

export const getReportingLocations = (state, adminLevel) => {
  return adminLevel ? getLocations(state).filter(location => location.get("admin_level") === adminLevel) : fromJS([]);
};

export const getLoadingState = state => state.getIn([NAMESPACE, "loading"], false);

export const getErrors = state => state.getIn([NAMESPACE, "errors"], false);

export const getSelectedForm = state => state.getIn([NAMESPACE, "selectedForm"]);

export const getServiceToRefer = state => state.getIn([NAMESPACE, "serviceToRefer"], fromJS({}));

export const getOptionsAreLoading = state => state.getIn([NAMESPACE, "options", "loading"], false);

export const getAssignableForms = state =>
  state.getIn([NAMESPACE, "formSections"], fromJS([])).filter(form => !form.get("is_nested") && form.get("visible"));

export const getValidationErrors = (state, formUniqueId) => {
  const validationErrors = state.getIn([NAMESPACE, "validationErrors"], fromJS([]));

  if (!formUniqueId) {
    return validationErrors;
  }

  return validationErrors.find(error => error.get("unique_id") === formUniqueId);
};

export const getSubformsDisplayName = (state, locale) =>
  state
    .getIn([NAMESPACE, "formSections"], fromJS([]))
    .filter(fs => fs.is_nested)
    .map(fs => fromJS({ [fs.unique_id]: fs.getIn(["name", locale]) }))
    .reduce((acc, next) => acc.merge(next), fromJS({}));

export const getAttachmentForms = (state, locale) => {
  const attachmentFieldIds = state
    .getIn([NAMESPACE, "fields"])
    .entrySeq()
    .map(
      ([id, field]) =>
        ["audio_upload_box", "document_upload_box", "photo_upload_box"].includes(field.get("type")) && parseInt(id, 10)
    )
    .filter(id => Boolean(id));

  return state
    .getIn([NAMESPACE, "formSections"], fromJS([]))
    .filter(fs => fs.fields.some(fieldId => attachmentFieldIds.includes(fieldId)))
    .map(fs => fromJS({ [fs.unique_id]: fs.getIn(["name", locale]) }))
    .reduce((acc, next) => acc.merge(next), fromJS({}));
};

export const getFields = state => state.getIn([NAMESPACE, "fields"]);

export const getAllForms = state => state.getIn([NAMESPACE, "formSections"]);
