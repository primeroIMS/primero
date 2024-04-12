// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import DB from "../db";

const Common = {
  find: async ({ collection }) => {
    const data = await DB.getRecord(collection, 1);

    return { data };
  },

  save: async ({ collection, json }) => {
    await DB.put({ store: collection, data: json.data, key: { id: 1 } });

    return json;
  }
};

export default Common;
