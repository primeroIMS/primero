/* eslint-disable import/prefer-default-export */

export const touchedFormData = (
  touched,
  data,
  hasInitialValues = false,
  initialValues
) => {
  return Object.keys(touched).reduce((prev, current) => {
    const obj = prev;

    if (Array.isArray(touched[current])) {
      obj[current] = [];
      touched[current].forEach((value, key) => {
        obj[current][key] = touchedFormData(
          value,
          data[current][key],
          hasInitialValues,
          initialValues?.[current]?.[key]
        );
      });
    } else if (
      (hasInitialValues && initialValues?.[current] !== data[current]) ||
      !hasInitialValues
    ) {
      obj[current] = data[current];
    }

    return obj;
  }, {});
};
