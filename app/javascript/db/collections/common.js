import DB from "../db";

const Common = {
  find: async ({ collection }) => {
    const data = await DB.getRecord(collection, 1);

    return { data };
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json.data, { id: 1 });

    return json;
  }
};

export default Common;
