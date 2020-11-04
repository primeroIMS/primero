/* eslint-disable import/prefer-default-export */

import { FETCH_DATA } from "./actions";

export const fetchContactInformation = () => {
  return {
    type: FETCH_DATA,
    api: {
      path: "contact_information"
    }
  };
};
