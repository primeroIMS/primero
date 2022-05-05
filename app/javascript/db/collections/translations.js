import { DB_COLLECTIONS_NAMES } from "../constants";
import DB from "../db";

const Translations = {
  find: async () => {
    const translations = await DB.getRecord(DB_COLLECTIONS_NAMES.TRANSLATIONS, 1);

    return translations;
  },

  save: async json => {
    await DB.put(DB_COLLECTIONS_NAMES.TRANSLATIONS, json, { id: 1 });

    return json;
  }
};

export default Translations;
