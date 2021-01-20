import DB from "../db";

import Logos from "./logos";

const Primero = {
  find: async ({ collection }) => {
    const data = await DB.getRecord(collection, 1);

    return { data };
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json.data, { id: 1 });

    if (json?.data?.agencies) {
      const logos = await Logos.save(json.data.agencies);
      const agenciesLogoPdf = await Logos.save(json.data.agencies_logo_options);

      return { data: { logos, agenciesLogoPdf, ...json.data } };
    }

    return json;
  }
};

export default Primero;
