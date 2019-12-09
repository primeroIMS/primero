import qs from "qs";

import { OR_FIELDS } from "../index-filters";

export const buildFilter = queryValue => {
  const value = queryValue.reduce((acum, obj) => {
    const v = obj.split("=");

    return {
      ...acum,
      ...(OR_FIELDS.includes(v[0])
        ? { or: { [v[0]]: v[1] } }
        : { [v[0]]: [v[1]] })
    };
  }, {});

  return qs.stringify(value);
};
