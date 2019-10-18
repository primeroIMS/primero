import { isEmpty } from "lodash";
import { CONSENT_GIVEN_FIELD_BY_MODULE } from "config";

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

export const hasProvidedConsent = record => {
  return record.get(CONSENT_GIVEN_FIELD_BY_MODULE[record.get("module_id")]);
};
