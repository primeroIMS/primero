import DB from "../db";
import { DB_COLLECTIONS_NAMES } from "../constants";

const Options = {
  find: async ({ collection }) => {
    return DB.getAll(collection);
  },

  save: async ({ collection, json, db }) => {
    const isLocations = collection === DB_COLLECTIONS_NAMES.LOCATIONS;
    const data = isLocations ? json : json.data;

    if (isLocations) {
      await DB.clear(collection);
      DB.put("manifests", { name: db?.manifest, collection });
    }

    await DB.bulkAdd(collection, data);

    return data;
  }
};

export default Options;
