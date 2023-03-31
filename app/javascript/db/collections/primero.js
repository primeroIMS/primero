import DB from "../db";

import Logos from "./logos";

const Primero = {
  find: async ({ collection }) => {
    const data = await DB.getRecord(collection, 1);

    return { data };
  },

  save: async ({ collection, json }) => {
    console.trace("trigger save===>");
    await DB.put({ store: collection, data: json.data, key: { id: 1 } });

    if (json?.data?.agencies) {
      const logos = await Logos.save(json.data.agencies);

      return { data: { logos, agenciesLogoPdf: [], ...json.data } };
    }

    return json;
  }
};

export default Primero;
