import { FETCH_REPORT } from "./actions";

export const fetchReport = id => {
  return {
    type: FETCH_REPORT,
    api: {
      path: `reports/${id}`
    }
  };
};
