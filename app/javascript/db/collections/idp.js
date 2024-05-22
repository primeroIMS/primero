// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import DB from "../db";

const Idp = {
  find: async ({ collection }) => {
    return DB.getRecord(collection, 1);
  },

  save: async ({ collection, json }) => {
    await DB.put({ store: collection, data: json, key: { id: 1 } });

    return json;
  }
};

export default Idp;
