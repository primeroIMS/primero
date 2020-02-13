import DB from "../db";

const User = {
  find: async ({ collection }) => {
    return DB.getRecord(collection, "primero");
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json.data);

    return json.data;
  }
};

export default User;
