export const buildFiltersApi = filters => {
  const excludeDefaultFiltersKeys = ["short", "per", "page"];
  return filters.reduce((obj, filter) => {
    const o = {};
    const [key, value] = filter;
    if (!excludeDefaultFiltersKeys.includes(key)) {
      const isArrayWithData = Array.isArray(value) && value.length > 0;
      const isObjectWithData =
        !Array.isArray(value) &&
        typeof value === "object" &&
        !Object.values(value).includes(null);

      if (isArrayWithData || isObjectWithData) {
        o.name = key;
        o.value = value;
      }
    }
    return obj.concat(o);
  }, []);
};

export const buildFiltersState = filters => {
  const result = filters.reduce((obj, props) => {
    const o = obj;
    o[props.name] = props.value;
    return o;
  }, {});
  return result;
};
