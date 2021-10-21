/* eslint-disable camelcase, no-param-reassign, no-shadow, func-names, no-use-before-define, no-lonely-if */
import { isEmpty, transform, isObject, isEqual, find, pickBy, identity, pick } from "lodash";
import { isDate, format } from "date-fns";
import { fromJS, isImmutable } from "immutable";
import orderBy from "lodash/orderBy";
import last from "lodash/last";
import isNil from "lodash/isNil";
import isPlainObject from "lodash/isPlainObject";

import {
  API_DATE_FORMAT,
  DEFAULT_DATE_VALUES,
  FORM_PERMISSION_ACTION,
  INCIDENT_FROM_CASE,
  RECORD_PATH,
  RECORD_TYPES
} from "../../config";
import { displayNameHelper, toServerDateFormat } from "../../libs";

import { NavRecord } from "./records";
import {
  SEPERATOR,
  SUBFORM_SECTION,
  PHOTO_FIELD,
  AUDIO_FIELD,
  DOCUMENT_FIELD,
  SELECT_FIELD,
  DATE_FIELD,
  TICK_FIELD
} from "./constants";
import { valuesWithHiddenAttribute } from "./form/subforms/subform-field-array/utils";

const FIELD_TYPES_WITHOUT_DEFAULT = Object.freeze([SUBFORM_SECTION, PHOTO_FIELD, AUDIO_FIELD, DOCUMENT_FIELD]);

function compareArray(value, base) {
  return value.reduce((acc, v) => {
    if (isObject(v)) {
      const baseSubform =
        ("unique_id" in v || "id" in v) &&
        find(base, b => (b.id && b.id === v.id) || (b.unique_id && b.unique_id === v.unique_id));

      if (baseSubform) {
        const diff = difference(v, baseSubform, true);

        if (!isEmpty(diff) && !("unique_id" in diff && Object.keys(diff).length === 1)) acc.push(diff);
      } else {
        const newSubform = pickBy(v, identity);

        if (emptyValues(newSubform)) {
          return acc;
        }

        if (!isEmpty(newSubform)) {
          acc.push(newSubform);
        }
      }
    } else {
      if (!isEmpty(v)) {
        acc.push(v);
      }
    }

    return acc;
  }, []);
}

function difference(object, base, nested) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key]) || (nested && key === "unique_id")) {
      let val = value;

      if (isDate(val)) {
        const initialValue = base[key];
        const currentValue = value.toISOString();

        val =
          !isEmpty(initialValue) && initialValue.length === currentValue.length
            ? value.toISOString()
            : format(value, API_DATE_FORMAT);
      }

      if (Array.isArray(val)) {
        result[key] = compareArray(val, base[key]);
      } else if (isObject(val) && isObject(base[key])) {
        result[key] = difference(val, base[key], true);
      } else {
        result[key] = val;
      }

      if (isObject(result[key]) && isEmpty(result[key]) && isEmpty(base[key])) {
        delete result[key];
      }
    }
  });
}

export const emptyValues = element => Object.values(element).every(isEmpty);

export const compactValues = (values, initialValues) => difference(values, initialValues);

export const compactBlank = values =>
  Object.entries(values)
    .filter(entry => {
      const value = last(entry);

      const valueIsEmpty =
        (Array.isArray(value) && isEmpty(value.filter(elem => !isNil(elem)))) ||
        (typeof value === "string" && value === "") ||
        (isImmutable(value) && value.isEmpty());

      return !isNil(value) && !valueIsEmpty;
    })
    .reduce((acc, entry) => {
      const [key, value] = entry;
      const fixedValue =
        Array.isArray(value) && value.some(item => isPlainObject(item)) ? value.map(val => compactBlank(val)) : value;

      return { ...acc, [key]: fixedValue };
    }, {});

export const getFieldDefaultValue = field => {
  if (FIELD_TYPES_WITHOUT_DEFAULT.includes(field.type)) {
    return [];
  }

  if (field.type === SELECT_FIELD && field.multi_select) {
    try {
      if (field.selected_value) {
        return field.selected_value.match(/\[.*\]$/) ? JSON.parse(field.selected_value) : [field.selected_value];
      }

      return [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Can't parse the defaultValue ${field.selected_value} for ${field.name}`);

      return [];
    }
  }

  if (field.type === DATE_FIELD) {
    return Object.values(DEFAULT_DATE_VALUES).some(defaultDate => field.selected_value?.toUpperCase() === defaultDate)
      ? toServerDateFormat(new Date(), { includeTime: field.date_include_time })
      : null;
  }

  if (field.type === TICK_FIELD) {
    return field.selected_value || false;
  }

  return field.selected_value || "";
};

export const constructInitialValues = formMap => {
  const [...forms] = formMap;

  return !isEmpty(forms)
    ? Object.assign(
        {},
        ...forms.map(form =>
          Object.assign(
            {},
            ...form.fields
              .filter(field => field.type !== SEPERATOR && field.visible)
              .map(field => ({ [field.name]: getFieldDefaultValue(field) }))
          )
        )
      )
    : {};
};

export const getRedirectPath = (mode, params, fetchFromCaseId) => {
  if (fetchFromCaseId) {
    return `/${RECORD_PATH.cases}/${fetchFromCaseId}`;
  }

  return mode.isNew ? "" : `/${params.recordType}/${params.id}`;
};

export const sortSubformValues = (record, formMap) => {
  const [...forms] = formMap;
  const subformsWithConfiguration = forms.reduce((acc, curr) => {
    const fields = curr.fields.filter(field => field.type === SUBFORM_SECTION && field.subform_section_configuration);

    return [...acc, ...fields];
  }, []);

  const recordValues = subformsWithConfiguration.reduce((acc, subform) => {
    const storedValues = record[subform.name];

    if (!isEmpty(storedValues)) {
      const { subform_section_configuration: subformSectionConfiguration } = subform;
      const displayConditions = subformSectionConfiguration?.display_conditions;
      const subformSortBy = subformSectionConfiguration?.subform_sort_by;

      const values = valuesWithHiddenAttribute(storedValues, displayConditions);
      const orderedValues = subformSortBy ? orderBy(values, [subformSortBy], ["asc"]) : values;

      return { ...acc, [subform.name]: orderedValues };
    }

    return acc;
  }, {});

  return recordValues;
};

export const buildFormNav = form =>
  NavRecord({
    group: form.form_group_id,
    groupOrder: form.order_form_group,
    name: displayNameHelper(form.name, window.I18n.locale),
    order: form.order,
    formId: form.unique_id,
    is_first_tab: form.is_first_tab,
    permission_actions: FORM_PERMISSION_ACTION[form.unique_id],
    i18nName: form.i18nName,
    i18nDescription: form.i18nDescription,
    ...(INCIDENT_FROM_CASE === form.unique_id ? { recordTypes: [RECORD_TYPES.cases] } : {})
  });

export const pickFromDefaultForms = (forms, defaultForms) => {
  const formUniqueIds = forms?.valueSeq().map(form => form.unique_id) || fromJS([]);

  return pick(
    defaultForms,
    Object.keys(defaultForms).filter(key => !formUniqueIds.includes(key))
  );
};
