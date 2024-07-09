// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export const touchedFormData = (touched, data, hasInitialValues = false, initialValues, keepArrayData = false) => {
  return Object.keys(touched).reduce((prev, current) => {
    const obj = prev;

    if (
      Array.isArray(touched[current]) &&
      Array.isArray(data[current]) &&
      data[current].find(elem => typeof elem === "object")
    ) {
      if (!keepArrayData) {
        obj[current] = [];
        touched[current].forEach((value, key) => {
          if (data[current][key]) {
            obj[current][key] = touchedFormData(
              value,
              data[current][key],
              hasInitialValues,
              initialValues?.[current]?.[key]
            );
          }
        });
      } else {
        obj[current] = data[current];
      }
    } else if ((hasInitialValues && initialValues?.[current] !== data?.[current]) || !hasInitialValues) {
      obj[current] = data[current];
    }

    return obj;
  }, {});
};
