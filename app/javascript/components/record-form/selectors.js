import isEmpty from "lodash/isEmpty";
import { fromJS, OrderedMap, List } from "immutable";

import { denormalizeFormData } from "../../schemas";
import { displayNameHelper } from "../../libs";
import { checkPermissions } from "../../libs/permissions";
import { INCIDENT_FROM_CASE, RECORD_INFORMATION_GROUP } from "../../config";

import { getDefaultForms, getDefaultRecordInfoForms } from "./form/utils";
import NAMESPACE from "./namespace";
import { buildFormNav, pickFromDefaultForms } from "./utils";

const filterForms = (forms, { recordType, primeroModule, checkVisible, includeNested }) => {
  const formSections = forms.filter(
    formSection =>
      (Array.isArray(primeroModule)
        ? formSection.module_ids.some(mod => primeroModule.includes(mod))
        : formSection.module_ids.includes(primeroModule)) &&
      formSection.parent_form === recordType &&
      (!includeNested ? !formSection.is_nested : true)
  );

  if (checkVisible === false) {
    return formSections;
  }

  return formSections.filter(fs => fs.visible);
};

const forms = (state, { recordType, primeroModule, checkVisible, all, formsIds, includeNested }) => {
  const allFormSections = state.getIn([NAMESPACE, "formSections"]);
  const formsPermitted = formsIds
    ?.keySeq()
    ?.toArray()
    .concat(Object.keys(getDefaultForms(window.I18n)));

  if (isEmpty(allFormSections)) return null;

  if (all) {
    return allFormSections;
  }

  const userFormSection = formsPermitted
    ? allFormSections.filter(fs => formsPermitted.includes(fs.unique_id))
    : allFormSections;

  return filterForms(userFormSection, { recordType, primeroModule, checkVisible, includeNested });
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

export const getFormNav = (state, query, userPermissions) => {
  const selectedForms = forms(state, query).filter(form => form.form_group_id !== RECORD_INFORMATION_GROUP);

  if (!selectedForms) return null;

  const { i18n, renderCustomForms, recordType, primeroModule } = query;
  let allSelectedForms = selectedForms;

  if (renderCustomForms) {
    const defaultForms = getDefaultForms(i18n);
    const formsFromDefault = pickFromDefaultForms(selectedForms, defaultForms);

    if (!isEmpty(formsFromDefault)) {
      const filteredCustomForms = filterForms(List(Object.values(formsFromDefault)), {
        recordType,
        primeroModule,
        checkVisible: true
      });

      const allCustomForms = filteredCustomForms.reduce((acc, form) => ({ ...acc, [form.id]: form }), {});

      allSelectedForms = allSelectedForms.concat(allCustomForms);
    }
  }

  return allSelectedForms
    .map(form => buildFormNav(form))
    .filter(form => isEmpty(form.permission_actions) || checkPermissions(userPermissions, form.permission_actions))
    .sortBy(form => form.order)
    .groupBy(form => form.group)
    .sortBy(form => form.first().get("groupOrder"));
};

export const getRecordInformationForms = (state, query) => {
  const recordInformationForms = forms(state, query)?.filter(
    form => form.form_group_id === RECORD_INFORMATION_GROUP && form.core_form
  );

  const defaultForms = getDefaultRecordInfoForms(query.i18n);

  const formsFromDefault = pickFromDefaultForms(recordInformationForms, defaultForms);

  const defaultFormsMap = OrderedMap(
    Object.values(formsFromDefault).reduce((acc, form) => ({ ...acc, [form.id]: form }), {})
  );

  return recordInformationForms?.size ? recordInformationForms.concat(defaultFormsMap) : defaultFormsMap;
};

export const getRecordInformationFormIds = (state, query) =>
  getRecordInformationForms(state, query)
    .valueSeq()
    .map(form => form.unique_id);

export const getIncidentFromCaseForm = (state, query) =>
  getRecordInformationForms(state, query)
    .valueSeq()
    .find(form => form.unique_id === INCIDENT_FROM_CASE);

export const getRecordInformationNav = (state, query, userPermissions) =>
  getRecordInformationForms(state, query)
    .map(form => buildFormNav(form))
    .filter(form => isEmpty(form.permission_actions) || checkPermissions(userPermissions, form.permission_actions))
    .sortBy(form => form.order);

export const getRecordForms = (state, query) => {
  const selectedForms = forms(state, query);

  if (!selectedForms) return null;
  const denormalizedForms = denormalizeFormData(OrderedMap(selectedForms.map(f => f.id)), state.getIn(["forms"]));

  return denormalizedForms.valueSeq();
};

export const getOrderedRecordForms = (state, query) => {
  return getRecordForms(state, query)
    .sortBy(fs => fs.order)
    .groupBy(fs => fs.group)
    .sortBy(fs => fs.first().get("groupOrder"))
    .valueSeq()
    .flatten();
};

export const getRecordFormsByUniqueId = (state, query) => {
  const { recordType, primeroModule, formName, checkVisible, i18n, includeNested, getFirst } = query;

  const allRecordForms = getRecordForms(state, {
    recordType,
    primeroModule,
    checkVisible,
    includeNested
  }).filter(f => f.unique_id === formName);

  const defaultForm = i18n && getDefaultForms(i18n)[formName];

  if (!allRecordForms?.size && defaultForm) {
    return getFirst ? defaultForm : List([defaultForm]);
  }

  if (getFirst) {
    return allRecordForms.first();
  }

  return allRecordForms;
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

export const getAttachmentForms = state => state.getIn([NAMESPACE, "attachmentMeta", "forms"], fromJS([]));

export const getAttachmentFields = state => state.getIn([NAMESPACE, "attachmentMeta", "fields"], fromJS([]));

export const getFields = state => state.getIn([NAMESPACE, "fields"], fromJS([]));

export const getAllForms = state => state.getIn([NAMESPACE, "formSections"]);

export const getFieldByName = (state, name) =>
  state.getIn([NAMESPACE, "fields"], fromJS([])).find(field => field.name === name);

export const getFieldsWithNames = (state, names) =>
  getFields(state)
    .valueSeq()
    .filter(field => names.includes(field.name))
    .reduce((acc, elem) => acc.set(elem.get("name"), elem), fromJS({}));

export const getMiniFormFields = (state, recordType, primeroModule, exclude = []) => {
  const recordForms = getRecordForms(state, { recordType, primeroModule, includeNested: false });

  return (recordForms || fromJS([]))
    .flatMap(form => form.get("fields"))
    .filter(field => field.show_on_minify_form && !exclude.includes(field.name));
};

export const getDataProtectionInitialValues = state =>
  state.getIn([NAMESPACE, "dataProtectionInitialValues"], fromJS({}));

export const getShouldFetchRecord = (state, { id, recordType }) => {
  return !state.getIn([NAMESPACE, "previousRecord"], fromJS({})).equals(fromJS({ id, recordType }));
};
