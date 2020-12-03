/* eslint-disable import/prefer-default-export */

import { DB_COLLECTIONS_NAMES } from "../../db";

import { FETCH_DATA } from "./actions";

export const fetchContactInformation = () => {
  return {
    type: FETCH_DATA,
    api: {
      path: "contact_information",
      db: {
        collection: DB_COLLECTIONS_NAMES.CONTACT_INFORMATION
      }
    }
  };
};
