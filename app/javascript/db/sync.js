import collections from "./collections";
import { DB_COLLECTIONS_NAMES, METHODS } from "./constants";

const syncIndexedDB = async (
  db = { recordType: "", collection: "" },
  json,
  method = METHODS.WRITE
) => {
  const { recordType, collection } = db;

  const getCollection = (() => {
    switch (collection) {
      case DB_COLLECTIONS_NAMES.OPTIONS:
      case DB_COLLECTIONS_NAMES.LOCATIONS: {
        return collections.Options;
      }
      case DB_COLLECTIONS_NAMES.FORMS: {
        return collections.Forms;
      }
      case DB_COLLECTIONS_NAMES.RECORDS: {
        return collections.Records;
      }
      case DB_COLLECTIONS_NAMES.SYSTEM_SETTINGS: {
        return collections.SystemSettings;
      }
      case DB_COLLECTIONS_NAMES.USER: {
        return collections.User;
      }
      case DB_COLLECTIONS_NAMES.IDP: {
        return collections.Idp;
      }
      case DB_COLLECTIONS_NAMES.DASHBOARDS: {
        return collections.Dashboards;
      }
      default: {
        return false;
      }
    }
  })();

  if (getCollection) {
    return getCollection[method === METHODS.WRITE ? "save" : "find"]({
      recordType,
      collection,
      json,
      db
    });
  }

  return json;
};

export default syncIndexedDB;
