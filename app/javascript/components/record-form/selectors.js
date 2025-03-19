// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import { fromJS, OrderedMap, List } from "immutable";
import createCachedSelector from "re-reselect";
import { createSelectorCreator, defaultMemoize } from "reselect";

import { denormalizeFormData } from "../../schemas";
import displayNameHelper from "../../libs/display-name-helper";
import { checkPermissions, getPermissionsByRecord } from "../permissions";
import {
  ALERTS_FOR,
  INCIDENT_FROM_CASE,
  MODULES,
  RECORD_INFORMATION_GROUP,
  RECORD_TYPES_PLURAL,
  SERVICES_SUBFORM_FIELD
} from "../../config";
import { FieldRecord } from "../form/records";
import { OPTION_TYPES, SUBFORM_SECTION } from "../form/constants";
import { getLocale } from "../i18n/selectors";
import { getRecordFormAlerts, getSelectedRecordData, selectRecord } from "../records";
import { selectorEqualityFn } from "../../libs/use-memoized-selector";
import { getPermittedFormsIds } from "../user";
import { getServicesForm } from "../application/selectors";

import getDefaultForms from "./form/utils/get-default-forms";
import NAMESPACE from "./namespace";
import { buildFormNav, pickFromDefaultForms } from "./utils";
import { RECORD_FORM_PERMISSION } from "./form/constants";

const defaultCacheSelectorOptions = {
  keySelector: (_state, query) => JSON.stringify(omitBy(query, isNil)),
  selectorCreator: createSelectorCreator(defaultMemoize, selectorEqualityFn)
};

const filterForms = (forms, { recordType, primeroModule, checkVisible, includeNested }) => {
  const formSections = forms.filter(formSection => {
    return (
      (Array.isArray(primeroModule)
        ? formSection.module_ids.some(mod => primeroModule.includes(mod))
        : formSection.module_ids.includes(primeroModule)) &&
      formSection.parent_form === recordType &&
      (!includeNested ? !formSection.is_nested : true)
    );
  });

  if (checkVisible === false) {
    return formSections;
  }

  return formSections.filter(fs => fs.visible);
};

const allFormSections = state => state.getIn([NAMESPACE, "formSections"], fromJS({}));

const forms = ({
  formSections,
  recordType,
  primeroModule,
  checkVisible,
  all,
  permittedFormIDs,
  includeNested,
  appLocale,
  checkPermittedForms = false,
  includeDefaultForms = true
}) => {
  const arrayOfPermittedFormIDs = permittedFormIDs?.keySeq()?.toArray() || [];
  const formsPermitted = includeDefaultForms
    ? arrayOfPermittedFormIDs.concat(Object.keys(getDefaultForms(appLocale)))
    : arrayOfPermittedFormIDs;

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

export const getPermittedForms = createCachedSelector(
  (state, query) =>
    selectRecord(state, {
      recordType: RECORD_TYPES_PLURAL[query.recordType],
      id: query.recordId,
      isEditOrShow: query.isEditOrShow
    })?.get("permitted_forms"),
  state => getPermittedFormsIds(state),
  (_state, query) => query,
  (recordForms, userForms, query) => {
    const permittedForms = recordForms && !recordForms.isEmpty() ? recordForms : userForms;

    if (query.writable || query.readOnly) {
      return permittedForms.filter(
        (key, value) =>
          (query.readOnly && value === RECORD_FORM_PERMISSION.readWrite) ||
          (query.writable && value === RECORD_FORM_PERMISSION.read)
      );
    }

    return permittedForms;
  }
)(defaultCacheSelectorOptions);

export const allPermittedForms = createCachedSelector(
  allFormSections,
  state => getPermittedFormsIds(state),
  getLocale,
  (_state, query) => query,
  (formSections, permittedFormIDs, appLocale, query) =>
    forms({ ...query, formSections, permittedFormIDs, appLocale, checkVisible: false })
)(defaultCacheSelectorOptions);

export const getFirstTab = createCachedSelector(
  allFormSections,
  (state, query) => getPermittedForms(state, query),
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
  (state, query) => getPermittedForms(state, query),
  (state, query) => getPermissionsByRecord([state, RECORD_TYPES_PLURAL[query?.recordType]]),
  (state, query) =>
    getSelectedRecordData(state, RECORD_TYPES_PLURAL[query?.recordType])?.getIn([
      "permitted_form_actions",
      query?.recordType
    ]),
  getLocale,
  (state, query) =>
    allPermittedForms(state, query)
      .valueSeq()
      .filter(form => form.form_group_id !== RECORD_INFORMATION_GROUP)
      .reduce((acc, form) => acc.merge(fromJS({ [form.unique_id]: form })), fromJS({})),
  (_state, query) => query,
  (formSections, permittedFormIDs, userPermissions, recordPermissions, appLocale, permittedForms, query) => {
    const selectedForms = forms({ ...query, formSections, permittedFormIDs, appLocale }).filter(
      form => form.form_group_id !== RECORD_INFORMATION_GROUP
    );

    if (!selectedForms) return null;

    const { renderCustomForms, recordType, primeroModule } = query;
    let allSelectedForms = selectedForms;

    if (renderCustomForms) {
      const defaultForms = getDefaultForms(appLocale, query);
      const formsFromDefault = pickFromDefaultForms(permittedForms, defaultForms);

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
      .filter(
        form =>
          isEmpty(form.permission_actions) ||
          checkPermissions(recordPermissions || userPermissions, form.permission_actions)
      )
      .sortBy(form => form.order)
      .groupBy(form => form.group)
      .sortBy(form => form.first().get("groupOrder"));
  }
)(defaultCacheSelectorOptions);

export const getRecordInformationForms = createCachedSelector(
  allFormSections,
  (state, query) => getPermittedForms(state, query),
  getLocale,
  (_state, query) => query,
  (formSections, permittedFormIDs, appLocale, query) => {
    const recordForms = forms({ ...query, formSections, permittedFormIDs, appLocale });
    const recordFormsById = recordForms.reduce(
      (acc, form) => acc.merge(fromJS({ [form.unique_id]: form })),
      fromJS({})
    );

    const defaultForms = getDefaultForms(appLocale, query);

    const formsFromDefault = pickFromDefaultForms(recordFormsById, defaultForms);

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
  (state, query) => getPermissionsByRecord([state, RECORD_TYPES_PLURAL[query?.recordType]]),
  (state, query) =>
    getSelectedRecordData(state, RECORD_TYPES_PLURAL[query?.recordType])?.getIn([
      "permitted_form_actions",
      query?.recordType
    ]),
  (formSections, userPermissions, recordPermissions) => {
    return formSections
      .map(form => buildFormNav(form))
      .filter(form => {
        return (
          isEmpty(form.permission_actions) ||
          checkPermissions(recordPermissions || userPermissions, form.permission_actions)
        );
      })
      .sortBy(form => form.order);
  }
)(defaultCacheSelectorOptions);

export const getRecordForms = createCachedSelector(
  allFormSections,
  state => state.getIn(["forms"], fromJS({})),
  (state, query) => getPermittedForms(state, query),
  getLocale,
  (_state, query) => query,
  (formSections, formObject, permittedFormIDs, appLocale, query) => {
    if (formSections.isEmpty()) return formSections;

    const selectedForms = forms({
      ...query,
      formSections,
      permittedFormIDs,
      appLocale
    });

    const denormalizedForms = denormalizeFormData(OrderedMap(selectedForms.map(form => form.id)), formObject);

    return denormalizedForms
      .map(formSection => formSection.set("userPermission", permittedFormIDs.get(formSection.unique_id)))
      .valueSeq();
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

export const getRecordFormsByUniqueIdWithFallback = (state, query) => {
  const form = getRecordFormsByUniqueId(state, query);

  if (form.isEmpty()) {
    return getRecordFormsByUniqueId(state, { ...query, primeroModule: query.fallbackModule });
  }

  return form;
};

export const getServicesRecordForm = (state, query) => {
  const servicesFormId = getServicesForm(state, query.primeroModule || query.fallbackModule);

  return getRecordFormsByUniqueIdWithFallback(state, {
    ...query,
    formName: servicesFormId
  })?.first();
};

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

export const getFieldByName = (state, name, moduleID, parentForm) => {
  const fields = state
    .getIn([NAMESPACE, "fields"], fromJS([]))
    .filter(field =>
      moduleID && parentForm
        ? parentForm === field.get("parent_form") && field.get("module_ids").includes(moduleID)
        : true
    );

  if (Array.isArray(name)) {
    return fields.filter(field => name.includes(field.name));
  }

  return fields.find(field => field.name === name);
};

export const getFieldsByName = (state, names = fromJS([])) => {
  return state.getIn([NAMESPACE, "fields"], fromJS([])).filter(field => names.includes(field.name));
};

export const getNestedFields = createCachedSelector(
  allFormSections,
  state => state.getIn(["forms"], fromJS({})),
  getLocale,
  (_state, query) => query,
  (formSections, formObject, appLocale, query) => {
    const selectedForms = forms({ ...query, formSections, all: true, appLocale });

    if (isNil(query.nestedFormIds)) {
      return fromJS([]);
    }

    const nestedForms = selectedForms.filter(form => form.is_nested && query.nestedFormIds.includes(form.id));

    let nestedFields = denormalizeFormData(OrderedMap(nestedForms.map(form => form.id)), formObject)
      .valueSeq()
      .flatMap(formSection => {
        if (query.includeFormSectionName) {
          return formSection.fields.map(field => {
            return field.set("form_section_name", formSection.get("name"));
          });
        }

        return formSection.fields;
      });

    if (!isEmpty(query.excludeTypes)) {
      nestedFields = nestedFields.filter(field => !query.excludeTypes.includes(field.type));
    }

    if (query.excludeFieldNames) {
      nestedFields = nestedFields.filter(field => !query.excludeFieldNames.includes(field.name));
    }

    if (query.omitDuplicates === true) {
      nestedFields = nestedFields
        .groupBy(field => field.name)
        .valueSeq()
        .map(fields => fields.first());
    }

    return nestedFields;
  }
)(defaultCacheSelectorOptions);

export const getRecordFields = createCachedSelector(
  getRecordForms,
  (_state, query) => query,
  (formSections, query) => {
    let recordFields = formSections.flatMap(formSection => {
      if (query.includeFormSectionName) {
        return formSection.fields.map(field => {
          return field.set("form_section_name", formSection.get("name"));
        });
      }

      return formSection.fields;
    });

    if (!isEmpty(query.excludeTypes)) {
      recordFields = recordFields.filter(field => !query.excludeTypes.includes(field.type));
    }

    if (query.omitDuplicates === true) {
      recordFields = recordFields
        .groupBy(field => field.name)
        .valueSeq()
        .map(fields => fields.first());
    }

    return recordFields;
  }
)(defaultCacheSelectorOptions);

export const getRecordFieldsByName = createCachedSelector(
  getRecordFields,
  (_state, query) => query,
  (fields, query) => {
    const { name } = query;

    if (Array.isArray(name)) {
      return fields.filter(field => name.includes(field.name));
    }

    return fields.find(field => field.name === name);
  }
)(defaultCacheSelectorOptions);

export const getMiniFormFields = (state, recordType, primeroModule, excludeFieldNames) => {
  const recordForms = getRecordForms(state, { recordType, primeroModule, includeNested: false, checkVisible: false });

  return (recordForms || fromJS([]))
    .flatMap(form => form.get("fields"))
    .filter(
      field =>
        field.show_on_minify_form &&
        (isEmpty(excludeFieldNames) || (!isEmpty(excludeFieldNames) && !excludeFieldNames.includes(field.name)))
    )
    .map(field => {
      const fieldRecord = FieldRecord(field);

      return fieldRecord.get("option_strings_source") === OPTION_TYPES.AGENCY
        ? fieldRecord.set("option_strings_source_id_key", "unique_id")
        : fieldRecord;
    });
};

export const getCommonMiniFormFields = (state, recordType, primeroModule, fieldNames) => {
  return getMiniFormFields(state, recordType, primeroModule)
    .filter(field => fieldNames.includes(field.name))
    .reduce((acc, elem) => acc.merge(fromJS({ [elem.name]: elem })), fromJS({}));
};

export const getDataProtectionInitialValues = state =>
  state.getIn([NAMESPACE, "dataProtectionInitialValues"], fromJS({}));

export const getShouldFetchRecord = (state, { id, recordType }) => {
  return !state.getIn([NAMESPACE, "previousRecord"], fromJS({})).equals(fromJS({ id, recordType }));
};

export const getPreviousRecordType = state => {
  return state.getIn([NAMESPACE, "previousRecord", "recordType"]);
};

export const getWritableFields = createCachedSelector(
  (state, query) => getRecordForms(state, { ...query, writable: true, checkPermittedForms: true }),
  formSections => formSections.flatMap(formSection => formSection.fields)
)(defaultCacheSelectorOptions);

export const getReadOnlyFields = createCachedSelector(
  (state, query) => getRecordForms(state, { ...query, readOnly: true, checkPermittedForms: true }),
  getWritableFields,
  (formSections, writableFields) => {
    const readOnlyFields = formSections.flatMap(formSection => formSection.fields);
    const writableFieldMap = writableFields.reduce((acc, field) => ({ ...acc, [field?.name]: true }), {});

    return readOnlyFields.filter(field => !writableFieldMap[field.name]);
  }
)(defaultCacheSelectorOptions);

export const getDuplicatedFieldAlerts = createCachedSelector(getRecordFormAlerts, alerts =>
  alerts.filter(alert => alert.get("alert_for") === ALERTS_FOR.duplicate_field)
)(defaultCacheSelectorOptions);

export const getDuplicatedFields = createCachedSelector(getDuplicatedFieldAlerts, getFields, (alerts, fields) => {
  const duplicatedFieldNames = alerts.map(alert => alert.get("type"));

  return fields.filter(field => duplicatedFieldNames.includes(field.name));
})(defaultCacheSelectorOptions);

export const getRedirectedToCreateNewRecord = state => state.getIn([NAMESPACE, "redirectedToCreateNewRecord"], false);

export const getSubFormForFieldName = createCachedSelector(
  (state, query) =>
    getRecordForms(state, { ...query, includeNested: true, primeroModule: query.primeroModule || MODULES.CP }),
  (_state, query) => query,
  (formSections, query) => {
    const formSection = formSections.find(form => form.fields.some(field => field.name === query.fieldName));

    return formSection?.fields?.find(field => field.name === query.fieldName)?.subform_section_id;
  }
)(defaultCacheSelectorOptions);

export const getIsServicesForm = createCachedSelector(
  (state, query) =>
    getRecordFormsByUniqueIdWithFallback(state, { ...query, fallbackModule: query.fallbackModule || MODULES.CP }),
  formSections =>
    formSections
      ?.first()
      ?.fields?.some(field => field.name === SERVICES_SUBFORM_FIELD && field.type === SUBFORM_SECTION)
)(defaultCacheSelectorOptions);
