export default (object, excludeKey) => {
  const keys = Object.keys(object);

  if (keys.length > 1) {
    return object[keys.filter(key => key !== excludeKey)[0]];
  }

  return object;
};
