import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import { fromJS, OrderedMap, List } from "immutable";
import createCachedSelector from "re-reselect";
import { createSelectorCreator, defaultMemoize } from "reselect";

import { denormalizeFormData } from "../../schemas";
import { displayNameHelper } from "../../libs";
import { checkPermissions } from "../../libs/permissions";
import { INCIDENT_FROM_CASE, RECORD_INFORMATION_GROUP } from "../../config";
import { FieldRecord } from "../form/records";
import { OPTION_TYPES } from "../form/constants";
import { getPermissionsByRecord } from "../user/selectors";
import { getLocale } from "../i18n/selectors";

import getDefaultForms from "./form/utils/get-default-forms";
import NAMESPACE from "./namespace";
import { buildFormNav, pickFromDefaultForms } from "./utils";

const defaultCacheSelectorOptions = {
  keySelector: (_state, query) => JSON.stringify(omitBy(query, isNil)),
  selectorCreator: createSelectorCreator(defaultMemoize, isEqual)
};

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

const allFormSections = state => state.getIn([NAMESPACE, "formSections"]);

const forms = ({
  formSections,
  recordType,
  primeroModule,
  checkVisible,
  all,
  permittedFormIDs,
  includeNested,
  appLocale,
  checkPermittedForms = false
}) => {
  const formsPermitted = permittedFormIDs
    ?.keySeq()
    ?.toArray()
    .concat(Object.keys(getDefaultForms(appLocale)));

  if (isEmpty(formSections)) return null;

  if (all) {
    return formSections;
  }

  const userFormSection =
    formsPermitted && checkPermittedForms
      ? formSections.filter(fs => formsPermitted.includes(fs.unique_id))
      : formSections;

  return filterForms(userFormSection, {
    recordType,
    primeroModule,
    checkVisible,
    includeNested
  });
};

const isAStickyOption = (opt, stickyOption) =>
  Array.isArray(stickyOption) ? stickyOption?.includes(opt.id) : opt.id === stickyOption?.toString();

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
    disabled: Boolean(opt.disabled),
    display_text: displayNameHelper(opt.display_text, locale) || ""
  }));
};

export const getFirstTab = createCachedSelector(
  allFormSections,
  state => state.getIn(["user", "permittedForms"], fromJS([])),
  getLocale,
  (_state, query) => query,
  (formSections, permittedFormIDs, appLocale, query) => {
    const selectedForms = forms({ ...query, formSections, permittedFormIDs, appLocale });

    if (selectedForms.isEmpty()) return null;

    const firstFormSection = selectedForms.filter(fs => fs.get("is_first_tab") === true);

    if (firstFormSection && firstFormSection.size > 0) {
      const form = firstFormSection.first();

      return form;
    }

    return selectedForms.first();
  }
)(defaultCacheSelectorOptions);

export const getFormNav = createCachedSelector(
  allFormSections,
  state => state.getIn(["user", "permittedForms"], fromJS([])),
  (state, query) => getPermissionsByRecord(state, query?.recordType),
  getLocale,
  (_state, query) => query,
  (formSections, permittedFormIDs, userPermissions, appLocale, query) => {
    const selectedForms = forms({ ...query, formSections, permittedFormIDs, appLocale }).filter(
      form => form.form_group_id !== RECORD_INFORMATION_GROUP
    );

    if (!selectedForms) return null;

    const { renderCustomForms, recordType, primeroModule } = query;
    let allSelectedForms = selectedForms;

    if (renderCustomForms) {
      const defaultForms = getDefaultForms(appLocale);
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
  }
)(defaultCacheSelectorOptions);

export const getRecordInformationForms = createCachedSelector(
  allFormSections,
  state => state.getIn(["user", "permittedForms"], fromJS([])),
  getLocale,
  (_state, query) => query,
  (formSections, permittedFormIDs, appLocale, query) => {
    const recordForms = forms({ ...query, formSections, permittedFormIDs, appLocale });

    const defaultForms = getDefaultForms(appLocale);

    const formsFromDefault = pickFromDefaultForms(recordForms, defaultForms);

    const defaultFormsMap = OrderedMap(
      Object.values(formsFromDefault).reduce((acc, form) => ({ ...acc, [form.id]: form }), {})
    );

    return (recordForms || fromJS({}))
      .merge(fromJS(defaultFormsMap))
      .filter(form => form.form_group_id === RECORD_INFORMATION_GROUP && form.core_form);
  }
)(defaultCacheSelectorOptions);

export const getRecordInformationFormIds = createCachedSelector(
  (state, query) => getRecordInformationForms(state, query),
  formSections => {
    return formSections.valueSeq().map(form => form.unique_id);
  }
)(defaultCacheSelectorOptions);

export const getRecordInformationNav = createCachedSelector(
  (state, query) => getRecordInformationForms(state, query),
  (state, query) => getPermissionsByRecord(state, query?.recordType),
  (formSections, userPermissions) => {
    return formSections
      .map(form => buildFormNav(form))
      .filter(form => isEmpty(form.permission_actions) || checkPermissions(userPermissions, form.permission_actions))
      .sortBy(form => form.order);
  }
)(defaultCacheSelectorOptions);

export const getRecordForms = createCachedSelector(
  allFormSections,
  state => state.getIn(["forms"], fromJS({})),
  state => state.getIn(["user", "permittedForms"], fromJS([])),
  getLocale,
  (_state, query) => query,
  (formSections, formObject, permittedFormIDs, appLocale, query) => {
    if (!formSections) return null;

    const selectedForms = forms({ ...query, formSections, permittedFormIDs, appLocale });

    const denormalizedForms = denormalizeFormData(OrderedMap(selectedForms.map(form => form.id)), formObject);

    return denormalizedForms.valueSeq();
  }
)(defaultCacheSelectorOptions);

export const getOrderedRecordForms = createCachedSelector(
  (state, query) => getRecordForms(state, query),
  formSections => {
    return formSections
      .sortBy(fs => fs.order)
      .groupBy(fs => fs.group)
      .sortBy(fs => fs.first().get("groupOrder"))
      .valueSeq()
      .flatten();
  }
)(defaultCacheSelectorOptions);

export const getRecordFormsByUniqueId = createCachedSelector(
  (state, query) => {
    const { recordType, primeroModule, checkVisible, includeNested } = query;

    return getRecordForms(state, {
      recordType,
      primeroModule,
      checkVisible,
      includeNested
    });
  },
  getLocale,
  (_state, query) => query,
  (formSections, appLocale, query) => {
    const { formName, getFirst } = query;

    const allRecordForms = formSections?.filter(f => f.unique_id === formName);

    const defaultForm = appLocale && getDefaultForms(appLocale)[formName];

    if (!allRecordForms?.toList()?.size && defaultForm) {
      return getFirst ? defaultForm : List([defaultForm]);
    }

    if (getFirst) {
      return allRecordForms.first();
    }

    return allRecordForms;
  }
)(defaultCacheSelectorOptions);

export const getIncidentFromCaseForm = (state, query) =>
  getRecordFormsByUniqueId(state, { ...query, formName: INCIDENT_FROM_CASE, getFirst: true });

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

export const getSubformsDisplayName = createCachedSelector(
  state => state.getIn([NAMESPACE, "formSections"], fromJS([])),
  (_state, query) => query,
  (formSections, locale) => {
    return formSections
      .filter(fs => fs.is_nested)
      .map(fs => fromJS({ [fs.unique_id]: fs.getIn(["name", locale]) }))
      .reduce((acc, next) => acc.merge(next), fromJS({}));
  }
)(defaultCacheSelectorOptions);

export const getAttachmentForms = state => state.getIn([NAMESPACE, "attachmentMeta", "forms"], fromJS([]));

export const getAttachmentFields = state => state.getIn([NAMESPACE, "attachmentMeta", "fields"], fromJS([]));

export const getFields = state => state.getIn([NAMESPACE, "fields"], fromJS([]));

export const getAllForms = state => state.getIn([NAMESPACE, "formSections"]);

export const getFieldByName = (state, name) =>
  state.getIn([NAMESPACE, "fields"], fromJS([])).find(field => field.name === name);

export const getFieldsWithNames = createCachedSelector(
  getFields,
  (_state, names) => names,
  (fields, names) => {
    return fields
      .valueSeq()
      .filter(field => names.includes(field.name))
      .reduce((acc, elem) => acc.set(elem.get("name"), elem), fromJS({}));
  }
)(defaultCacheSelectorOptions);

export const getFieldsWithNamesForMinifyForm = (state, names) =>
  getFields(state)
    .valueSeq()
    .filter(field => names.includes(field.name) && field.show_on_minify_form)
    .reduce((acc, elem) => acc.set(elem.get("name"), elem), fromJS({}));

export const getMiniFormFields = (state, recordType, primeroModule, exclude = []) => {
  const recordForms = getRecordForms(state, { recordType, primeroModule, includeNested: false, checkVisible: false });

  return (recordForms || fromJS([]))
    .flatMap(form => form.get("fields"))
    .filter(field => field.show_on_minify_form && !exclude.includes(field.name))
    .map(field => {
      const fieldRecord = FieldRecord(field);

      return fieldRecord.get("option_strings_source") === OPTION_TYPES.AGENCY
        ? fieldRecord.set("option_strings_source_id_key", "unique_id")
        : fieldRecord;
    });
};

export const getDataProtectionInitialValues = state =>
  state.getIn([NAMESPACE, "dataProtectionInitialValues"], fromJS({}));

export const getShouldFetchRecord = (state, { id, recordType }) => {
  return !state.getIn([NAMESPACE, "previousRecord"], fromJS({})).equals(fromJS({ id, recordType }));
};
