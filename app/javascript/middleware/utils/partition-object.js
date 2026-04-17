export default (obj, filterFn) =>
  Object.keys(obj).reduce(
    (result, key) =>
      filterFn(obj[key], key)
        ? [{ ...result[0], [key]: obj[key] }, result[1]]
        : [result[0], { ...result[1], [key]: obj[key] }],
    [{}, {}]
  );
