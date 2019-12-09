import qs from "qs";

export const buildFilter = queryValue => {
  const value = queryValue.reduce((acum, obj) => {
    const v = obj.split("=");

    return { ...acum, [v[0]]: [v[1]] };
  }, {});

  return qs.stringify(value);
};
