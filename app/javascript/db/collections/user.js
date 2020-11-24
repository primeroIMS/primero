import DB from "../db";

const User = {
  find: async ({ collection, db }) => {
    return DB.getRecord(collection, db.user);
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json.data);

    return json.data;
  }
};

export default User;
