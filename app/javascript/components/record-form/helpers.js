/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
import { isEmpty, transform, isEqual, isObject } from "lodash";
import { isDate, format } from "date-fns";
import * as C from "./constants";

function difference(object, base, nested) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key]) || (nested && key === "unique_id")) {
      let val = value;
      if (isDate(val)) {
        val = format(value, "dd-MMM-yyyy");
      }
      result[key] =
        isObject(value) && isObject(base[key])
          ? difference(value, base[key], true)
          : val;
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
