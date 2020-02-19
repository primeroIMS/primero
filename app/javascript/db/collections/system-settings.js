import DB from "../db";

const SystemSettings = {
  find: async ({ collection }) => {
    return DB.getRecord(collection, 1);
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json.data, { id: 1 });

    return json.data;
  }
};

export default SystemSettings;
