import DB from "../db";

const Dashboards = {
  find: async ({ collection, db }) => {
    return DB.getRecord(collection, db.group);
  },

  save: async ({ collection, json, db }) => {
    await DB.put({ store: collection, data: json, key: { id: db.group } });

    return json;
  }
};

export default Dashboards;
