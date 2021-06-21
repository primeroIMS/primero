import cloneDeep from "lodash/cloneDeep";
import omit from "lodash/omit";
import isNil from "lodash/isNil";

import { compactBlank } from "../components/record-form/utils";
import { DATE_FIELD, NUMERIC_FIELD } from "../components/record-form/constants";
import DB from "../db/db";
import { METHODS } from "../config";
import { valueParser } from "../components/form/utils";

import { OFFLINE_OMITTED_FIELDS } from "./constants";

const getFieldsToTransform = async () =>
  ((await DB.getAll("fields")) || []).filter(field => [NUMERIC_FIELD, DATE_FIELD].includes(field.type));

const transform = (data, fields) => {
  const clonedData = omit(cloneDeep(data), OFFLINE_OMITTED_FIELDS);

  fields.forEach(field => {
    if (!isNil(clonedData[field.name])) {
      clonedData[field.name] = valueParser(field.type, clonedData[field.name]);
    }
  });

  return clonedData;
};

export default async action => {
  const fieldsToTransform = await getFieldsToTransform();

  if (!action.api.method || action.api.method === METHODS.GET) {
    return action;
  }

  return {
    ...action,
    api: {
      ...action.api,
      body: {
        data:
          action.api.method === METHODS.POST
            ? compactBlank(transform(action.api.body.data, fieldsToTransform))
            : transform(action.api.body.data, fieldsToTransform)
      }
    }
  };
};
