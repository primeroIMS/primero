import { DB_STORES } from "../../db/constants";

import generateRecordProperties from "./generate-record-properties";

export default (action, store, db) => {
  const { api } = action;
  const { recordType, collection } = db;
  const isRecord = collection === DB_STORES.RECORDS;

  const generatedProperties = generateRecordProperties(
    store,
    api,
    recordType,
    isRecord
  );

  return {
    ...action,
    api: {
      ...api,
      body: { data: { ...api?.body?.data, ...generatedProperties } }
    }
  };
};
