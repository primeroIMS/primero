import DB from "../db";

const Options = {
  find: async ({ collection }) => {
    return DB.getAll(collection);
  },

  save: async ({ collection, json }) => {
    await DB.bulkAdd(collection, json.data);

    return json.data;
  }
};

export default Options;
