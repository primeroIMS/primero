/* eslint-disable no-param-reassign, no-shadow, func-names, no-use-before-define, no-lonely-if */
import {
  isEmpty,
  transform,
  isObject,
  isEqual,
  find,
  pickBy,
  identity
} from "lodash";
import { isDate, format } from "date-fns";

import * as C from "./constants";

function compareArray(value, base) {
  return value.reduce((acc, v) => {
    if (isObject(v)) {
      const baseSubform = find(base, b => {
        return b.unique_id === v.unique_id;
      });

      if (baseSubform) {
        const diff = difference(v, baseSubform, true);

        if (
          !isEmpty(diff) &&
          !("unique_id" in diff && Object.keys(diff).length === 1)
        )
          acc.push(diff);
      } else {
        const newSubform = pickBy(v, identity);

        if (!isEmpty(newSubform)) acc.push(newSubform);
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
            : format(value, "dd-MMM-yyyy");
      }

      if (Array.isArray(val)) {
        result[key] = compareArray(val, base[key]);
      } else if (isObject(val) && isObject(base[key])) {
        result[key] = difference(val, base[key], true);
      } else {
        result[key] = val;
      }

      if (isObject(result[key]) && isEmpty(result[key])) {
        delete result[key];
      }
    }
  });
}

export const compactValues = (values, initialValues) =>
  difference(values, initialValues);

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

              if (
                [
                  C.SUBFORM_SECTION,
                  C.PHOTO_FIELD,
                  C.AUDIO_FIELD,
                  C.DOCUMENT_FIELD
                ].includes(f.type) ||
                (f.type === C.SELECT_FIELD && f.multi_select)
              ) {
                defaultValue = [];
              } else if ([C.DATE_FIELD].includes(f.type)) {
                defaultValue = null;
              } else if (f.type === C.TICK_FIELD) {
                defaultValue = false;
              } else {
                defaultValue = "";
              }

              return { [f.name]: defaultValue };
            })
          )
        )
      )
    : {};
};
