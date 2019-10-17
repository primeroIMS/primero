import { isEmpty } from "lodash";

const dirtyFields = (values, removeFields, fields) => {
  const data = Object.entries(values).reduce((obj, item) => {
    const o = obj;
    const [key, value] = item;
    if (fields.includes(key) && !isEmpty(value)) {
      o[key] = value;
    }
    return o;
  }, {});

  return removeFields ? data : Object.keys(data).length > 0;
};

export const getInternalFields = (values, fields) => {
  return dirtyFields(values, true, fields);
};

export const internalFieldsDirty = (values, fields) => {
  return dirtyFields(values, false, fields);
};
