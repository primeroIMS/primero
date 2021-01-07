import { List, OrderedMap, fromJS } from "immutable";
import extend from "lodash/extend";
import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";

import { FIELD_ATTACHMENT_TYPES } from "../components/record-form/form/field-types/attachments/constants";

export const namespaceActions = (namespace, keys) =>
  Object.freeze(keys.reduce((map, key) => extend(map, { [key]: `${namespace}/${key}` }), {}));

export const mapEntriesToRecord = (entries, record, ordered) => {
  const mapFunc = ordered ? OrderedMap : fromJS;

  return Array.isArray(entries) ? List(entries.map(e => record(e))) : mapFunc(mapValues(entries, e => record(e)));
};

export const mapObjectPropertiesToRecords = (entries, record) => {
  return Object.keys(entries).reduce((prev, value) => {
    const p = prev;

    p[value] = mapEntriesToRecord(entries[value], record);

    return p;
  }, {});
};

export const mapListToObject = (entries, key, val) => {
  return entries.reduce((prev, value) => {
    const p = prev;

    p[value[key]] = value[val];

    return p;
  }, {});
};

export const listEntriesToRecord = (entries, record) => {
  return List(entries?.map(entry => record(entry)) || []);
};

export const arrayToObject = (data, key = "id") => {
  return data.reduce((obj, item) => {
    const o = obj;

    o[item[key]] = item;

    return o;
  }, {});
};

export const listAttachmentFields = (formSections = [], fields = []) => {
  const types = Object.keys(FIELD_ATTACHMENT_TYPES);
  const filteredFields = Object.values(fields).filter(field => types.includes(field.type));
  const fieldIds = filteredFields.map(field => field.form_section_id);
  const attachmentFormSections = Object.values(formSections).filter(formSection => fieldIds.includes(formSection.id));

  return {
    fields: filteredFields.map(item => item.name),
    forms: attachmentFormSections.reduce((prev, current) => {
      const obj = prev;

      obj[current.unique_id] = current.name;

      return obj;
    }, {})
  };
};

export const mergeRecord = (record, payload) => {
  return record.mergeWith((prev, next) => {
    // Everything else
    return next;
  }, payload);
};

export const rejectKeys = (collection, keys = []) => {
  return pickBy(collection, (value, key) => keys.include(key));
};
