import { List, Map } from "immutable";

export const dataToJS = data => {
  if (data instanceof Map || data instanceof List) {
    return data.toJS();
  }

  return data;
};

export const valuesToSearchableSelect = (
  data,
  searchValue,
  searchLabel,
  locale
) => {
  const values = dataToJS(data);

  const result = values.map(value => {
    return Object.entries(value).reduce((acum, v) => {
      const obj = acum;
      const [key, val] = v;

      if (key === searchValue) {
        obj.value = val;
      }
      if (key === searchLabel) {
        obj.label = typeof val === "object" ? val[locale] : val;
      }

      return obj;
    }, {});
  });

  return result;
};
