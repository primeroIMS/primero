import { RECORD_PATH } from "../../../../config";

import actions from "./actions";

export const fetchAgencies = data => {
  const { options } = data || {};

  const params =
    options &&
    Object.entries(options).reduce((acc, option) => {
      const [key, value] = option;

      if (value.length >= 2) {
        return acc;
      }

      return { ...acc, [key]: value[0] };
    }, {});

  return {
    type: actions.AGENCIES,
    api: {
      path: RECORD_PATH.agencies,
      params
    }
  };
};
