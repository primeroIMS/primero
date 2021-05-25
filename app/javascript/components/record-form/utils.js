/* eslint-disable camelcase, no-param-reassign, no-shadow, func-names, no-use-before-define, no-lonely-if */
import { isEmpty, transform, isObject, isEqual, find, pickBy, identity, pick } from "lodash";
import { isDate, format } from "date-fns";
import { fromJS } from "immutable";
import orderBy from "lodash/orderBy";

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
  SUBFORM_SECTION,
  PHOTO_FIELD,
  AUDIO_FIELD,
  DOCUMENT_FIELD,
  SELECT_FIELD,
  DATE_FIELD,
  TICK_FIELD
} from "./constants";
import { valuesWithHiddenAttribute } from "./form/subforms/subform-field-array/utils";

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

export const constructInitialValues = formMap => {
  const [...forms] = formMap;

  return !isEmpty(forms)
    ? Object.assign(
        {},
        ...forms.map(v =>
          Object.assign(
            {},
            ...v.fields.map(f => {
              let defaultValue;

              if ([SUBFORM_SECTION, PHOTO_FIELD, AUDIO_FIELD, DOCUMENT_FIELD].includes(f.type)) {
                defaultValue = [];
              } else if (f.type === SELECT_FIELD && f.multi_select) {
                try {
                  defaultValue = f.selected_value ? JSON.parse(f.selected_value) : [];
                } catch (e) {
                  defaultValue = [];
                  // eslint-disable-next-line no-console
                  console.warn(`Can't parse the defaultValue ${f.selected_value} for ${f.name}`);
                }
              } else if ([DATE_FIELD].includes(f.type)) {
                defaultValue = Object.values(DEFAULT_DATE_VALUES).some(
                  defaultDate => f.selected_value?.toUpperCase() === defaultDate
                )
                  ? toServerDateFormat(new Date(), { includeTime: f.date_include_time })
                  : null;
              } else if (f.type === TICK_FIELD) {
                defaultValue = f.selected_value || false;
              } else {
                defaultValue = f.selected_value || "";
              }

              return { [f.name]: defaultValue };
            })
          )
        )
      )
    : {};
};

export const getRedirectPath = (mode, params, fetchFromCaseId) => {
  if (fetchFromCaseId) {
    return `/${RECORD_PATH.cases}/${fetchFromCaseId}`;
  }

  return mode.isNew ? `/${params.recordType}` : `/${params.recordType}/${params.id}`;
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
    ...(INCIDENT_FROM_CASE === form.unique_id ? { recordTypes: [RECORD_TYPES.cases] } : {})
  });

export const pickFromDefaultForms = (forms, defaultForms) => {
  const formUniqueIds = forms?.valueSeq().map(form => form.unique_id) || fromJS([]);

  return pick(
    defaultForms,
    Object.keys(defaultForms).filter(key => !formUniqueIds.includes(key))
  );
};
