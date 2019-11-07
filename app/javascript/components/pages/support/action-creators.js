import { FETCH_DATA } from "./actions";

export const fetchData = () => {
  return {
    type: FETCH_DATA,
    api: {
      path: "contact_information"
    }
  };
};
