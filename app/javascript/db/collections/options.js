// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import DB from "../db";
import { DB_COLLECTIONS_NAMES } from "../constants";

const Options = {
  find: async ({ collection }) => {
    return DB.getAll(collection);
  },

  save: async ({ collection, json, db }) => {
    const isLocations = collection === DB_COLLECTIONS_NAMES.LOCATIONS;
    const { data } = json;

    if (isLocations) {
      await DB.clear(collection);
      DB.put({ store: "manifests", data: { name: db?.manifest, collection } });
    }

    await DB.bulkAdd({ store: collection, data });

    return data;
  }
};

export default Options;
