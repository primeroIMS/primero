import DB from "../db";

const Dashboards = {
  find: async ({ collection }) => {
    return DB.getRecord(collection, 1);
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json, { id: 1 });

    return json;
  }
};

export default Dashboards;
