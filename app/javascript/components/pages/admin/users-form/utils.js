function replaceNullWithBlank(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const newObj = {};

  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      newObj[key] = "";
    } else if (typeof obj[key] === "object") {
      // If the property value is an object, recursively call replaceNullWithBlank
      newObj[key] = replaceNullWithBlank(obj[key]);
    } else {
      // If the property value is not null or an object, copy it to the new object
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

// eslint-disable-next-line import/prefer-default-export
export { replaceNullWithBlank };
