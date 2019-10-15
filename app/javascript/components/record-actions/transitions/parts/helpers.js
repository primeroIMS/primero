import { isEmpty } from "lodash";

const dirtyFields = (values, isExternal, removeFields, fields) => {
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
  return dirtyFields(values, false, true, fields);
};

export const getExternalFields = (values, fields) => {
  return dirtyFields(values, true, true, fields);
};

export const externalFieldsDirty = (values, fields) => {
  return dirtyFields(values, true, false, fields);
};

export const internalFieldsDirty = (values, fields) => {
  return dirtyFields(values, false, false, fields);
};
