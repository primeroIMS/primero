import DB from "../db";

import Logos from "./logos";

const User = {
  find: async ({ collection, db }) => {
    return DB.getRecord(collection, db.user);
  },

  save: async ({ collection, json }) => {
    await DB.put(collection, json.data);

    // eslint-disable-next-line camelcase
    if (json?.data?.agency_logo_full && json?.data?.agency_logo_icon) {
      const logos = await Logos.save([
        {
          unique_id: json.data.agency_unique_id,
          name: json.data.agency_name,
          logo_full: json.data.agency_logo_full,
          logo_icon: json.data.agency_logo_icon
        }
      ]);

      return { ...json.data, agencyLogo: logos[0] };
    }

    return json.data;
  }
};

export default User;
