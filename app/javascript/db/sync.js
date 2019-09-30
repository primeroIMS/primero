import { DB as DB_COLLECTIONS } from "config";
import DB from "./db";
import * as schemas from "../schemas";

export const syncIndexedDB = async (
  db = { recordType: "", collection: "" },
  json,
  normalizeFunc
) => {
  const { recordType, collection } = db;

  switch (collection) {
    case DB_COLLECTIONS.USER:
      await DB.put(collection, json.data);
      return json.data;
    case DB_COLLECTIONS.SYSTEM_SETTINGS:
      await DB.put(collection, json.data, { id: 1 });
      return json.data;
    case DB_COLLECTIONS.RECORDS: {
      const { data, metadata } = json;
      const dataIsArray = Array.isArray(data);
      const recordData = Array.isArray(data)
        ? data
        : { ...data, complete: true };

      if (dataIsArray) {
        await DB.bulkAdd(collection, recordData, {
          index: "type",
          value: recordType
        });
      } else {
        await DB.put(collection, recordData, null, {
          index: "type",
          value: recordType
        });
      }
      return {
        data: recordData,
        ...(dataIsArray && { metadata })
      };
    }
    case DB_COLLECTIONS.FORMS: {
      const { formSections, fields } = schemas[normalizeFunc](
        json.data
      ).entities;

      await DB.bulkAdd("forms", formSections);
      await DB.bulkAdd("fields", fields);

      return {
        formSections,
        fields
      };
    }
    default:
      return json;
  }
};
