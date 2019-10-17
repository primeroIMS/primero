import { isEmpty } from "lodash";

export const getInternalFields = (values, fields) => {
  return Object.entries(values).reduce((obj, item) => {
    const o = obj;
    const [key, value] = item;
    if (fields.includes(key) && !isEmpty(value)) {
      o[key] = value;
    }
    return o;
  }, {});
};

export const internalFieldsDirty = (values, fields) => {
  const data = getInternalFields(values, fields);
  return Object.keys(data).length > 0;
};
